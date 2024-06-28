import Container from "@/components/container";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import TicketRow from "./components/ticket";
import prismaClient from "@/lib/prisma";

const Dashboard = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/");
  }

  const tickets = await prismaClient.ticket.findMany({
    where: {
      customer: {
        userId: session.user.id,
      },
      status: "ABERTO",
    },
    include: { customer: true },
    orderBy: { created_at: "desc" },
  });

  return (
    <Container>
      <main className="mt-9 mb-2">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-3xl font-bold">Chamados</h1>
          <Link
            href="/dashboard/new"
            className="bg-blue-500 px-4 py-1 rounded text-white"
          >
            Abrir chamado
          </Link>
        </div>

        <table className="min-w-full my-2">
          <thead>
            <tr>
              <th className="font-medium text-left uppercase">Cliente</th>
              <th className="font-medium text-left uppercase">Data Cadastro</th>
              <th className="font-medium text-left uppercase">Status</th>
              <th className="font-medium text-left uppercase">#</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <TicketRow
                key={ticket.id}
                ticket={ticket}
                customer={ticket.customer}
              />
            ))}
          </tbody>
        </table>
        {tickets.length === 0 && (
          <h1 className="text-gray-500">
            Nenhum ticket aberto foi encontrado...
          </h1>
        )}
      </main>
    </Container>
  );
};

export default Dashboard;
