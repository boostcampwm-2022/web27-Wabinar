import { BLOCK_EVENT } from '@wabinar/constants/socket-message';
import { useState, useEffect } from 'react';
import { VoteMode } from 'src/constants/block';
import useSocketContext from 'src/hooks/useSocketContext';
import { Option } from 'src/types/block';

import VoteBlockTemplate from './VoteBlockTemplate';

interface VoteBlockProps {
  id: string;
  registerable: boolean;
}

function VoteBlock({ id, registerable }: VoteBlockProps) {
  const { momSocket: socket } = useSocketContext();

  const [voteMode, setVoteMode] = useState<VoteMode>(
    registerable ? VoteMode.REGISTERING : VoteMode.CREATE,
  );
  const initialOption: Option[] = [{ id: 1, text: '', count: 0 }];
  const [options, setOptions] = useState<Option[]>(initialOption);

  useEffect(() => {
    socket.on(`${BLOCK_EVENT.REGISTER_VOTE}-${id}`, (options) => {
      setVoteMode(VoteMode.REGISTERED as VoteMode);
      setOptions(options);
    });
  }, []);

  return (
    <VoteBlockTemplate
      id={id}
      mode={voteMode}
      setVoteMode={setVoteMode}
      options={options}
      setOptions={setOptions}
    />
  );
}

export default VoteBlock;
