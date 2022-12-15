import useMyMediaStreamContext from './context/useMyMediaStreamContext';

export const useCreateMediaStream = () => {
  const { myMediaStream, setMyMediaStream, setIsMyMicOn, setIsMyCamOn } =
    useMyMediaStreamContext();

  const toggleAudioStream = (enabled: boolean) => {
    if (myMediaStream) {
      myMediaStream.getAudioTracks().forEach((track) => {
        track.enabled = !enabled;
      });
    }
    setIsMyMicOn(enabled);
    setMyMediaStream(new MediaStream());
  };

  const toggleVideoStream = (enabled: boolean) => {
    if (myMediaStream) {
      myMediaStream.getVideoTracks().forEach((track) => {
        myMediaStream.removeTrack(track);
        track.stop();
      });
    }
    setIsMyCamOn(enabled);
    setMyMediaStream(new MediaStream());
  };

  const createAudioStream = async () => {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      myMediaStream.addTrack(audioStream.getAudioTracks()[0]);

      setIsMyMicOn(true);
      setMyMediaStream(myMediaStream);
    } catch (error) {
      console.debug('failed to get audio stream', error);
    }
  };

  const createVideoStream = async () => {
    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      myMediaStream.addTrack(videoStream.getVideoTracks()[0]);

      setIsMyCamOn(true);
      setMyMediaStream(myMediaStream);
    } catch (error) {
      console.debug('failed to get video stream', error);
    }
  };

  return {
    toggleAudioStream,
    toggleVideoStream,
    createAudioStream,
    createVideoStream,
  };
};
