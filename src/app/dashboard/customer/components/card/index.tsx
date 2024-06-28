"use client";

import { api } from "@/lib/api";
import { CustomerProps } from "@/utils/customer.types";
import { useRouter } from "next/navigation";

const CardCustomer = ({ customer }: { customer: CustomerProps }) => {
  const router = useRouter();

  const handleDeleteCustomer = async () => {
    try {
      await api.delete("/api/customer", {
        params: {
          id: customer.id,
        },
      });

      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <article className="flex flex-col bg-gray-100 border-2 p-2 rounded-lg gap-2 hover:scale-105 duration-300">
      <h2>
        <span className="font-bold">Nome:</span> {customer.name}
      </h2>
      <p>
        <span className="font-bold">E-mail:</span> {customer.email}
      </p>
      <p>
        <span className="font-bold">Telefone:</span> {customer.phone}
      </p>
      <button
        className="bg-red-500 px-4 rounded text-white mt-2 self-start"
        onClick={handleDeleteCustomer}
      >
        Deletar
      </button>
    </article>
  );
};

export default CardCustomer;
