"use client";

import Input from "@/components/input";
import { api } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "O campo nome é obrigatório"),
  email: z
    .string()
    .email("Digite um e-mail válido")
    .min(1, "O campo e-mail é obrigatório"),
  phone: z.string().refine(
    (value) => {
      return (
        /^(?:\(\d{2}\)\s?)?\d{9}$/.test(value) ||
        /^\d{2}\s\d{9}$/.test(value) ||
        /^\d{11}$/.test(value)
      );
    },
    {
      message: "O número de telefone deve estar no formato (99) 99999-9999",
    }
  ),
  address: z.string(),
});

type FormData = z.infer<typeof schema>;

interface CustomerFormProps {
  userId: string;
}

const CustomerForm = ({ userId }: CustomerFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const router = useRouter();

  const handleRegister = async (data: FormData) => {
    await api.post("/api/customer", {
      ...data,
      userId,
    });

    router.replace("/dashboard/customer");
    router.refresh();
  };

  return (
    <form
      className="flex flex-col mt-6"
      onSubmit={handleSubmit(handleRegister)}
    >
      <label htmlFor="name" className="text-lg font-medium">
        Nome completo
      </label>

      <Input
        type="text"
        name="name"
        placeholder="Digite o nome completo"
        error={errors.name?.message}
        register={register}
      />
      <section className="flex gap-2 my-2 flex-col sm:flex-row">
        <div className="flex-1">
          <label htmlFor="name" className="mb-1 text-lg font-medium">
            Telefone
          </label>
           
          <Input
            type="text"
            name="phone"
            placeholder="(99) 99999-9999"
            error={errors.phone?.message}
            register={register}
          />
        </div>

        <div className="flex-1">
          <label htmlFor="email" className="mb-1 text-lg font-medium">
            E-mail
          </label>
           
          <Input
            type="email"
            name="email"
            placeholder="Digite o e-mail"
            error={errors.email?.message}
            register={register}
          />
        </div>
      </section>

      <label htmlFor="address" className="text-lg font-medium">
        Endereço
      </label>

      <Input
        type="text"
        name="address"
        placeholder="Digite o endereço"
        error={errors.address?.message}
        register={register}
      />

      <button
        type="submit"
        className="bg-blue-500 my-4 px-2 h-11 rounded text-white font-bold"
      >
        Cadastrar
      </button>
    </form>
  );
};

export default CustomerForm;
