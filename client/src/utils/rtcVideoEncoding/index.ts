export interface RTCVideoEncodingParams {
  maxBitrate?: number;
  maxFrame?: number;
  resolutionScaleFactor?: number;
}

// This function sets video encoding with the configuration parameters, supported by 'RTCRtpEncodingParameters'
// See 'Instance properties' (https://developer.mozilla.org/en-US/docs/Web/API/RTCRtpEncodingParameters)
export async function setRTCVideoEncoding(
  pc: RTCPeerConnection,
  { maxBitrate, maxFrame, resolutionScaleFactor }: RTCVideoEncodingParams = {},
) {
  const videoSender = pc
    .getSenders()
    .find((sender) => sender!.track!.kind === 'video');
  if (!videoSender) {
    return;
  }

  const params: RTCRtpSendParameters = videoSender.getParameters();
  if (maxBitrate !== undefined) {
    params.encodings[0].maxBitrate = maxBitrate;
  }
  if (maxFrame !== undefined) {
    params.encodings[0].maxFramerate = maxFrame;
  }
  if (resolutionScaleFactor !== undefined) {
    params.encodings[0].scaleResolutionDownBy = resolutionScaleFactor;
  }

  await videoSender.setParameters(params);
}
