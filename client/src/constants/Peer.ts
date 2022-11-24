import { Socket } from 'socket.io';

type onMediaConnectedCb = (socketId: string, remoteStream: MediaStream) => void;
type onMediaDisconnectedCb = (socketId: string) => void;

class PeerCom {
  static BITRATE = 30000;
  private signalingServerSocket: Socket;
  private iceServerUrls: string[];
  private userMediaStream: MediaStream;
  private connections: Map<string, RTCPeerConnection>;
  private streams: Map<string, MediaStream>;
  private onMediaConnectedCallback: onMediaConnectedCb;
  private onMediaDisconnectedCallback: onMediaDisconnectedCb;

  constructor(
    signalingServerSocket: Socket,
    iceServerUrls: string[],
    userMediaStream: MediaStream,
  ) {
    this.signalingServerSocket = signalingServerSocket;
    this.iceServerUrls = iceServerUrls;
    this.userMediaStream = userMediaStream;
    this.connections = new Map();
    this.streams = new Map();
    this.onMediaConnectedCallback = () => {}; // eslint-disable-line @typescript-eslint/no-empty-function
    this.onMediaDisconnectedCallback = () => {}; // eslint-disable-line @typescript-eslint/no-empty-function
  }

  onMediaConnected(callback: onMediaConnectedCb) {
    this.onMediaConnectedCallback = callback;
  }

  onMediaDisconnected(callback: onMediaDisconnectedCb) {
    this.onMediaDisconnectedCallback = callback;
  }

  #createPeerConnection(remoteSocketId: string) {
    // initialize
    const pcOptions = {
      iceServers: [{ urls: this.iceServerUrls }],
    };
    const pc = new RTCPeerConnection(pcOptions);

    // add event listeners
    pc.addEventListener('icecandidate', (iceEvent) => {
      this.signalingServerSocket.emit(
        '__peercom_send_ice',
        iceEvent.candidate,
        remoteSocketId,
      );
    });
    pc.addEventListener('track', async (event) => {
      if (this.streams.has(remoteSocketId)) {
        return;
      }

      const [remoteStream] = event.streams;

      this.streams.set(remoteSocketId, remoteStream);
      this.onMediaConnectedCallback(remoteSocketId, remoteStream);
    });

    // add tracks
    this.userMediaStream
      .getTracks()
      .forEach((track) => pc.addTrack(track, this.userMediaStream));

    return pc;
  }

  async #setVideoBitrate(pc: RTCPeerConnection, bitrate: number) {
    // fetch video sender
    const [videoSender] = pc
      .getSenders()
      .filter((sender) => sender!.track!.kind === 'video');

    // set bitrate
    const params = videoSender.getParameters();
    params.encodings[0].maxBitrate = bitrate;
    await videoSender.setParameters(params);
  }

  connect() {
    this.signalingServerSocket.on('receive_hello', async (remoteSocketId) => {
      const pc = this.#createPeerConnection(remoteSocketId);
      this.connections.set(remoteSocketId, pc);

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      this.signalingServerSocket.emit(
        'send_offer',
        pc.localDescription,
        remoteSocketId,
      );
    });

    this.signalingServerSocket.on(
      'receive_offer',
      async (offer, remoteSocketId) => {
        const pc = this.#createPeerConnection(remoteSocketId);
        this.connections.set(remoteSocketId, pc);

        await pc.setRemoteDescription(offer);

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        this.#setVideoBitrate(pc, PeerCom.BITRATE);

        this.signalingServerSocket.emit('send_answer', answer, remoteSocketId);
      },
    );

    this.signalingServerSocket.on(
      'receive_answer',
      async (answer, remoteSocketId) => {
        const pc = this.connections.get(remoteSocketId);
        if (!pc) {
          throw new Error('No RTCPeerConnection on answer received.');
        }

        await pc.setRemoteDescription(answer);

        this.#setVideoBitrate(pc, PeerCom.BITRATE);
      },
    );

    this.signalingServerSocket.on('receive_ice', (ice, remoteSocketId) => {
      const pc = this.connections.get(remoteSocketId);
      if (!pc) {
        throw new Error('No RTCPeerConnection on ice candindate received.');
      }

      pc.addIceCandidate(ice);
    });

    this.signalingServerSocket.on('receive_bye', (remoteSocketId) => {
      this.connections.delete(remoteSocketId);
      this.streams.delete(remoteSocketId);

      this.onMediaDisconnectedCallback(remoteSocketId);
    });

    this.signalingServerSocket.emit('send_hello');
  }
}

export default PeerCom;
