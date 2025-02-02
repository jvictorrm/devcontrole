import Container from "@/components/container";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import prismaClient from "@/lib/prisma";

const NewTicket = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/");
  }

  const customers = await prismaClient.customer.findMany({
    where: { userId: session.user.id },
  });

  async function handleRegisterTicker(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const customerId = formData.get("customer") as string;

    if (!name || !description || !customerId) return;

    await prismaClient.ticket.create({
      data: {
        name,
        description,
        customerId,
        status: "ABERTO",
        userId: session?.user.id,
      },
    });

    redirect("/dashboard");
  }

  return (
    <Container>
      <main className="mt-9 mb-2">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-white px-4 py-1 rounded bg-gray-900"
          >
            Voltar
          </Link>
          <h1 className="text-3xl font-bold">Novo chamado</h1>
        </div>

        <form className="flex flex-col mt-6" action={handleRegisterTicker}>
          <label className="mb-1 font-medium text-lg">Nome do chamado</label>
          <input
            className="w-full border-2 rounded-md px-2 mb-2 h-11"
            type="text"
            placeholder="Digite o nome do chamado"
            required
            name="name"
          />

          <label className="mb-1 font-medium text-lg">
            Descreva o problema
          </label>
          <textarea
            className="w-full border-2 rounded-md p-2 mb-2 h-24 resize-none"
            placeholder="Descreva o problema..."
            required
            name="description"
          />

          <label className="mb-1 font-medium text-lg">
            Selecione o cliente
          </label>

          {customers.length !== 0 && (
            <select
              className="w-full border-2 rounded-md p-2 mb-2 h-11 bg-white"
              name="customer"
            >
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          )}

          {customers.length === 0 && (
            <Link href="/dashboard/customer/new">
              <span className="text-blue-500 font-medium">
                Cadastre um cliente
              </span>
              , pois ainda não temos nenhum registrado.
            </Link>
          )}

          <button
            type="submit"
            className="bg-blue-500 text-white font-bold px-2 h-11 rounded my-4 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={customers.length === 0}
          >
            Cadastrar
          </button>
        </form>
      </main>
    </Container>
  );
};

export default NewTicket;
