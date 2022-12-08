import { WORKSPACE_EVENT } from '@wabinar/constants/socket-message';
import { Socket } from 'socket.io-client';

type SocketId = string;

type onMediaConnectedCb = (socketId: string, remoteStream: MediaStream) => void;
type onMediaDisconnectedCb = (socketId: string) => void;

class RTC {
  static BITRATE = 30000;
  private socket: Socket;
  private iceServerUrls: string[];
  private userMediaStream: MediaStream;
  private connections: Map<string, RTCPeerConnection>;
  private streams: Map<string, MediaStream>;
  private onMediaConnectedCallback: onMediaConnectedCb;
  private onMediaDisconnectedCallback: onMediaDisconnectedCb;

  constructor(
    socket: Socket,
    iceServerUrls: string[],
    userMediaStream: MediaStream,
  ) {
    this.socket = socket;
    this.iceServerUrls = iceServerUrls;
    this.userMediaStream = userMediaStream;
    this.connections = new Map();
    this.streams = new Map();
    this.onMediaConnectedCallback = () => {}; // eslint-disable-line @typescript-eslint/no-empty-function
    this.onMediaDisconnectedCallback = () => {}; // eslint-disable-line @typescript-eslint/no-empty-function
  }

  connect() {
    this.socket.on(
      WORKSPACE_EVENT.RECEIVE_HELLO,
      this.setDescriptionAndEmitOffer.bind(this),
    );
    this.socket.on(
      WORKSPACE_EVENT.RECEIVE_OFFER,
      this.setDescriptionAndEmitAnswer.bind(this),
    );
    this.socket.on(
      WORKSPACE_EVENT.RECEIVE_ANSWER,
      this.setDescriptionForAnswer.bind(this),
    );
    this.socket.on(WORKSPACE_EVENT.RECEIVE_ICE, this.addIce.bind(this));
    this.socket.on(WORKSPACE_EVENT.RECEIVE_BYE, this.disconnectPeer.bind(this));

    this.socket.emit(WORKSPACE_EVENT.SEND_HELLO);
  }

  onMediaConnected(callback: onMediaConnectedCb) {
    this.onMediaConnectedCallback = callback;
  }

  onMediaDisconnected(callback: onMediaDisconnectedCb) {
    this.onMediaDisconnectedCallback = callback;
  }

  private async setDescriptionAndEmitOffer(remoteSocketId: SocketId) {
    const pc = this.createPeerConnection(remoteSocketId);
    this.connections.set(remoteSocketId, pc);

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    this.socket.emit(WORKSPACE_EVENT.SEND_OFFER, offer, remoteSocketId);
  }

  private async setDescriptionAndEmitAnswer(
    offer: RTCSessionDescriptionInit,
    remoteSocketId: SocketId,
  ) {
    const pc = this.createPeerConnection(remoteSocketId);
    await pc.setRemoteDescription(offer);
    this.connections.set(remoteSocketId, pc);

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    this.socket.emit(WORKSPACE_EVENT.SEND_ANSWER, answer, remoteSocketId);
  }

  private async setDescriptionForAnswer(
    answer: RTCSessionDescriptionInit,
    remoteSocketId: SocketId,
  ) {
    const pc = this.connections.get(remoteSocketId);
    if (!pc) {
      throw new Error('No RTCPeerConnection on answer received.');
    }

    await pc.setRemoteDescription(answer);
  }

  private async addIce(ice: RTCIceCandidate, remoteSocketId: SocketId) {
    const pc = this.connections.get(remoteSocketId);
    if (!pc) {
      throw new Error('No RTCPeerConnection on ice candindate received.');
    }

    await pc.addIceCandidate(ice);
  }

  private async disconnectPeer(remoteSocketId: SocketId) {
    this.connections.delete(remoteSocketId);
    this.streams.delete(remoteSocketId);

    this.onMediaDisconnectedCallback(remoteSocketId);
  }

  private createPeerConnection(remoteSocketId: string) {
    // initialize
    const pcOptions = {
      iceServers: [{ urls: this.iceServerUrls }],
    };
    const pc = new RTCPeerConnection(pcOptions);

    pc.addEventListener('icecandidate', (event) =>
      this.emitIce(event, remoteSocketId),
    );
    pc.addEventListener('track', (event) =>
      this.addRemoteStream(event, remoteSocketId),
    );
    this.addTracksToLocalConnection(pc);

    return pc;
  }

  private emitIce(event: RTCPeerConnectionIceEvent, remoteSocketId: string) {
    this.socket.emit(WORKSPACE_EVENT.SEND_ICE, event.candidate, remoteSocketId);
  }

  private addRemoteStream(event: RTCTrackEvent, remoteSocketId: string) {
    if (this.streams.has(remoteSocketId)) {
      return;
    }

    const [remoteStream] = event.streams;

    this.streams.set(remoteSocketId, remoteStream);
    this.onMediaConnectedCallback(remoteSocketId, remoteStream);
  }

  private addTracksToLocalConnection(pc: RTCPeerConnection) {
    this.userMediaStream
      .getTracks()
      .forEach((track) => pc.addTrack(track, this.userMediaStream));
  }

  // unused; may be used in the future
  private async setVideoBitrate(pc: RTCPeerConnection, bitrate: number) {
    // fetch video sender
    const [videoSender] = pc
      .getSenders()
      .filter((sender) => sender!.track!.kind === 'video');

    // set bitrate
    const params = videoSender.getParameters();
    params.encodings[0].maxBitrate = bitrate;
    await videoSender.setParameters(params);
  }
}

export default RTC;
