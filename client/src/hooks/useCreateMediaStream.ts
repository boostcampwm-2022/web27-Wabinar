import useMyMediaStreamContext from './useMyMediaStream';
import usePcsContext from './usePcsContext';

export const useCreateMediaStream = () => {
  const { myMediaStream, setMyMediaStream, setIsMyMicOn, setIsMyCamOn } =
    useMyMediaStreamContext();
  const { pcs } = usePcsContext();

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

    if (pcs) {
      for (const pc of Object.values(pcs)) {
        const senders = pc.getSenders();
        const sender = senders.find((s) => s.track?.kind === 'video');

        if (sender) {
          pc.removeTrack(sender);
        }
      }
    }
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

      if (pcs) {
        for (const pc of Object.values(pcs)) {
          myMediaStream.getTracks().forEach((track) => {
            pc.addTrack(track, myMediaStream);
          });
        }
      }

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
