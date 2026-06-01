import ResetPasswordClient from '@/components/ResetPasswordClient';

type Props = {
  searchParams: Promise<{ token_hash?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { token_hash } = await searchParams;

  return (
    <div className="flex items-center justify-center p-6">
      <ResetPasswordClient token={token_hash ?? ''} />
    </div>
  );
}