import { WORKSPACE_EVENT } from '@wabinar/constants/socket-message';
import env from 'config';
import { Socket } from 'socket.io-client';
import { setRTCVideoEncoding } from 'src/utils/rtcVideoEncoding';

type onMediaConnectedCb = (socketId: string, remoteStream: MediaStream) => void;
type onMediaDisconnectedCb = (socketId: string) => void;

class RTC {
  static MAX_BITRATE = Number(env.WEBRTC_VIDEO_MAX_BITRATE);
  static MAX_FRAME = Number(env.WEBRTC_VIDEO_MAX_FRAME);
  static RESOLUTION_SCALE_FACTOR = Number(env.WEBRTC_RESOLUTION_SCALE_FACTOR);

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

    this.socket.on(
      WORKSPACE_EVENT.RECEIVE_HELLO,
      this.sendOfferOnHello.bind(this),
    );
    this.socket.on(
      WORKSPACE_EVENT.RECEIVE_OFFER,
      this.sendAnswerOnOffer.bind(this),
    );
    this.socket.on(
      WORKSPACE_EVENT.RECEIVE_ANSWER,
      this.setRemotePeerOnAnswer.bind(this),
    );
    this.socket.on(WORKSPACE_EVENT.RECEIVE_ICE, this.addIce.bind(this));
    this.socket.on(
      WORKSPACE_EVENT.RECEIVE_BYE,
      this.cleanUpRemoteAndEmitMediaDisconnectedEvent.bind(this),
    );
  }

  connect() {
    this.socket.emit(WORKSPACE_EVENT.SEND_HELLO);
  }

  onMediaConnected(callback: onMediaConnectedCb) {
    this.onMediaConnectedCallback = callback;
  }

  onMediaDisconnected(callback: onMediaDisconnectedCb) {
    this.onMediaDisconnectedCallback = callback;
  }

  private async sendOfferOnHello(remoteSocketId: string) {
    const pc = this.createPeerConnection(remoteSocketId);

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    this.socket.emit(WORKSPACE_EVENT.SEND_OFFER, offer, remoteSocketId);
  }

  private async sendAnswerOnOffer(
    offer: RTCSessionDescriptionInit,
    remoteSocketId: string,
  ) {
    const pc = this.createPeerConnection(remoteSocketId);
    await pc.setRemoteDescription(offer);

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    setRTCVideoEncoding(pc, {
      maxBitrate: RTC.MAX_BITRATE,
      maxFrame: RTC.MAX_FRAME,
      resolutionScaleFactor: RTC.RESOLUTION_SCALE_FACTOR,
    });

    this.socket.emit(WORKSPACE_EVENT.SEND_ANSWER, answer, remoteSocketId);
  }

  private async setRemotePeerOnAnswer(
    answer: RTCSessionDescriptionInit,
    remoteSocketId: string,
  ) {
    const pc = this.connections.get(remoteSocketId);
    if (!pc) {
      throw new Error('No RTCPeerConnection on answer received.');
    }

    await pc.setRemoteDescription(answer);

    setRTCVideoEncoding(pc, {
      maxBitrate: RTC.MAX_BITRATE,
      maxFrame: RTC.MAX_FRAME,
      resolutionScaleFactor: RTC.RESOLUTION_SCALE_FACTOR,
    });
  }

  private addIce(ice: RTCIceCandidateInit, remoteSocketId: string) {
    const pc = this.connections.get(remoteSocketId);
    if (!pc) {
      throw new Error('No RTCPeerConnection on ice candindate received.');
    }

    pc.addIceCandidate(ice);
  }

  private cleanUpRemoteAndEmitMediaDisconnectedEvent(remoteSocketId: string) {
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

    // add event listeners
    const emitIce: (iceEvent: RTCPeerConnectionIceEvent) => void =
      this.emitIce.bind(this, remoteSocketId);
    pc.addEventListener('icecandidate', emitIce);

    const setRemoteTrack: (trackEvent: RTCTrackEvent) => void =
      this.setRemoteTrackAndEmitMediaConnectedEvent.bind(this, remoteSocketId);
    pc.addEventListener('track', setRemoteTrack);

    // add tracks
    this.userMediaStream
      .getTracks()
      .forEach((track) => pc.addTrack(track, this.userMediaStream));

    // register connection
    this.connections.set(remoteSocketId, pc);

    return pc;
  }

  private emitIce(remoteSocketId: string, iceEvent: RTCPeerConnectionIceEvent) {
    this.socket.emit(
      WORKSPACE_EVENT.SEND_ICE,
      iceEvent.candidate,
      remoteSocketId,
    );
  }

  private setRemoteTrackAndEmitMediaConnectedEvent(
    remoteSocketId: string,
    trackEvent: RTCTrackEvent,
  ) {
    if (this.streams.has(remoteSocketId)) {
      return;
    }

    const [remoteStream] = trackEvent.streams;

    this.streams.set(remoteSocketId, remoteStream);
    this.onMediaConnectedCallback(remoteSocketId, remoteStream);
  }
}

export default RTC;
