import RegisterClient from "@/components/RegisterClient";

interface RegisterPageProps {
  searchParams: Promise<{ email?: string }>;
}

export default async function RegisterPage({searchParams}: RegisterPageProps) {
  const { email } = await searchParams;
  return (
    <div className=" flex items-center justify-center p-6">
      <RegisterClient prefillEmail={email}/>
    </div>
  );
}
