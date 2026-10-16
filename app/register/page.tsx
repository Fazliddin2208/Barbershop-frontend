import AuthShell from "@/components/auth/AuthShell";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthShell title="Open your shop">
      <RegisterForm />
    </AuthShell>
  );
}
