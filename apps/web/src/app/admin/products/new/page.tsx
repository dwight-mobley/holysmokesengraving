import AdminProductForm from '@/components/AdminProductForm';
export default function NewProductPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-brand-800">New Product</h1>
      <AdminProductForm />
    </div>
  );
}