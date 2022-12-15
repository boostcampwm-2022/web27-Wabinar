import { setTrack, getTrack } from './';

const MediaStream = jest.fn().mockImplementation((tracks) => {
  return new MediaStreamMock(tracks);
});

let stream: any;

describe('getTrack()', () => {
  describe('스트림에 트랙이 있을 때', () => {
    beforeEach(() => {
      stream = new MediaStream();
    });

    it('audio 트랙을 성공적으로 가져온다.', async () => {
      // act
      const track = await getTrack(stream, 'audio');

      // assert
      expect(track).not.toBe(undefined);
    });

    it('video 트랙을 성공적으로 가져온다.', async () => {
      // act
      const track = await getTrack(stream, 'video');

      // assert
      expect(track).not.toBe(undefined);
    });
  });

  describe('스트림에 트랙이 없을 때', () => {
    beforeEach(() => {
      stream = new MediaStream([]); // empty track
    });

    it('audio 트랙을 가져오면 리턴 값이 없다.', async () => {
      // act
      const track = await getTrack(stream, 'audio');

      // assert
      expect(track).toBe(undefined);
    });

    it('video 트랙을 가져오면 리턴 값이 없다.', async () => {
      // act
      const track = await getTrack(stream, 'video');

      // assert
      expect(track).toBe(undefined);
    });
  });
});

describe('setTrack()', () => {
  describe('스트림에 트랙이 있을 때', () => {
    beforeEach(() => {
      stream = new MediaStream();
    });

    it('audio 트랙을 비활성화 시킬 수 있다.', async () => {
      // act
      setTrack(stream, 'audio', false);

      // assert
      const track = await getTrack(stream, 'audio');
      expect(track!.enabled).toBe(false);
    });

    it('video 트랙을 비활성화 시킬 수 있다.', async () => {
      // act
      setTrack(stream, 'video', false);

      // assert
      const track = await getTrack(stream, 'video');
      expect(track!.enabled).toBe(false);
    });

    it('비활성화 된 audio 트랙을 활성화 시킬 수 있다.', async () => {
      // arrange
      setTrack(stream, 'audio', false);

      // act
      setTrack(stream, 'audio', true);

      // assert
      const track = await getTrack(stream, 'audio');
      expect(track!.enabled).toBe(true);
    });

    it('비활성화 된 video 트랙을 활성화 시킬 수 있다.', async () => {
      // arrange
      setTrack(stream, 'video', false);

      // act
      setTrack(stream, 'video', true);

      // assert
      const track = await getTrack(stream, 'video');
      expect(track!.enabled).toBe(true);
    });
  });

  describe('스트림에 트랙이 없을 때', () => {
    beforeEach(() => {
      stream = new MediaStream([]); // empty tracks
    });

    it('audio 트랙을 비활성화하면 조용히 무시된다.', async () => {
      // assert
      expect(() => setTrack(stream, 'audio', false)).not.toThrow();
    });

    it('video 트랙을 비활성화하면 조용히 무시된다.', async () => {
      // assert
      expect(() => setTrack(stream, 'video', false)).not.toThrow();
    });
  });
});

// mock
class MediaStreamMock {
  private tracks: TrackMock[];

  // 기본적으로 'audio', 'video' 트랙을 두 개 갖도록 만든다.
  constructor(tracks = [new TrackMock('video'), new TrackMock('audio')]) {
    this.tracks = tracks;
  }

  getTracks() {
    return this.tracks;
  }
}

class TrackMock {
  kind: string;
  enabled: boolean;

  constructor(kind: string) {
    this.kind = kind;
    this.enabled = true;
  }
}
