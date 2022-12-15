interface BubblesProps {
  className?: string;
}

function BubblesIcon({ className }: BubblesProps) {
  return (
    <img
      className={className}
      src="https://user-images.githubusercontent.com/63364990/207814310-bc20af5b-7118-46a8-bdb3-6470712889eb.jpeg"
      alt="버블 아이콘"
    />
  );
}

export default BubblesIcon;
