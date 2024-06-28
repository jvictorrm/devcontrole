import Input from "@/components/input";
import { api } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CustomerDataInfo } from "../../page";

const schema = z.object({
  name: z.string().min(1, "O campo nome do chamado é obrigatório"),
  description: z.string().min(1, "O campo descrição é obrigatório"),
});

type FormData = z.infer<typeof schema>;

interface FormTicketProps {
  customer: CustomerDataInfo;
}

const FormTicket = ({ customer }: FormTicketProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function handleRegisterTicket(data: FormData) {
    await api.post("/api/ticket", {
      customerId: customer.id,
      name: data.name,
      description: data.description,
    });

    setValue("name", "");
    setValue("description", "");
  }

  return (
    <form
      className="bg-slate-200 mt-6 px-4 py-6 rounded border-2"
      onSubmit={handleSubmit(handleRegisterTicket)}
    >
      <label className="mb-1 font-medium text-lg">Nome do chamado</label>
      <Input
        name="name"
        type="text"
        placeholder="Digite o nome do chamado..."
        error={errors.name?.message}
        register={register}
      />

      <label className="mb-1 font-medium text-lg">Descreva o problema</label>
      <textarea
        className="w-full border-2 rounded-md h-24 resize-none mb-1 px-2"
        placeholder="Descreva o seu problema..."
        id="description"
        {...register("description")}
      />
      {errors.description?.message && (
        <p className="text-red-500 my-1">{errors.description?.message}</p>
      )}

      <button
        type="submit"
        className="bg-blue-500 rounded-md w-full h-11 px-2 text-white font-bold"
      >
        Cadastrar
      </button>
    </form>
  );
};

export default FormTicket;
