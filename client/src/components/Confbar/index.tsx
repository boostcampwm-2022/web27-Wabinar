import { IParticipant } from 'src/types/rtc';

interface ConfBarProps {
  participants: IParticipant[];
}

function ConfBar({ participants }: ConfBarProps) {
  return (
    <div>
      <ul>
        {participants.map(({ stream }, idx) => (
          <li key={idx}>
            <video src="" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ConfBar;
