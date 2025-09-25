import { ExamLayout } from 'src/layouts/exam';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return <ExamLayout>{children}</ExamLayout>;
}
