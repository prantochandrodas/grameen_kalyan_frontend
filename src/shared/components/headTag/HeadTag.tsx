import type { Metadata } from 'next';

type HeaderProps = {
  title: string;
};

const HeadTag = ({ title }: HeaderProps) => {
  const metadata: Metadata = {
    title: `Grameen Kalyan | ${title}`,
    description:
      'Grameen Kalyan believes in trust, quality and innovation in delivering services. We are on a mission to transform healthcare in Bangladesh at primary, ...',
  };

  return metadata;
};

export default HeadTag;
