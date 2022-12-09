export type TrackKind = 'audio' | 'video';

const getAllTracks = async (stream: MediaStream) => {
  if (!stream) {
    return;
  }

  const tracks = stream.getTracks();
  return tracks;
};

const getTrack = async (stream: MediaStream, kind: TrackKind) => {
  const tracks = await getAllTracks(stream);
  if (!tracks) {
    return;
  }

  const track = tracks.find((track) => track.kind === kind);
  return track;
};

export const setTrack = async (
  stream: MediaStream,
  kind: TrackKind,
  turnOn: boolean,
) => {
  if (!stream) {
    return;
  }

  const track = await getTrack(stream, kind);
  if (!track) {
    return;
  }

  track.enabled = turnOn;
};
