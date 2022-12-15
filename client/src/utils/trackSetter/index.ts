export type TrackKind = 'audio' | 'video';

const getAllTracks = async (stream: MediaStream) => {
  const tracks = stream.getTracks();

  return tracks;
};

export const getTrack = async (stream: MediaStream, kind: TrackKind) => {
  const tracks = await getAllTracks(stream);
  const track = tracks.find((track) => track.kind === kind);

  return track;
};

export const setTrack = async (
  stream: MediaStream,
  kind: TrackKind,
  turnOn: boolean,
) => {
  const track = await getTrack(stream, kind);
  if (!track) {
    return;
  }

  track.enabled = turnOn;
};
