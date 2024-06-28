"use client";

import { api } from "@/lib/api";
import { ModalContext } from "@/providers/modal";
import { CustomerProps } from "@/utils/customer.types";
import { TicketProps } from "@/utils/ticket.types";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { FiCheckSquare, FiFile } from "react-icons/fi";

interface TicketRowProps {
  ticket: TicketProps;
  customer: CustomerProps | null;
}

const TicketRow = ({ customer, ticket }: TicketRowProps) => {
  const router = useRouter();
  const { handleModalVisible, setTicketDetail } = useContext(ModalContext);

  async function handleChangeStatus() {
    try {
      await api.patch("/api/ticket", {
        id: ticket.id,
      });

      router.refresh();
    } catch (error) {
      console.log(error);
    }
  }

  function handleOpenModal() {
    setTicketDetail({ ticket, customer });
    handleModalVisible();
  }

  return (
    <tr className="border-b-2 border-b-slate-200 h-16 last:border-b-0 bg-slate-50 hover:bg-gray-200 duration-300">
      <td className="text-left pl-1">{customer?.name}</td>
      <td className="text-left">
        {ticket.created_at?.toLocaleDateString("pt-br")}
      </td>
      <td className="text-left">
        <span className="bg-green-500 px-2 py-1 rounded">{ticket.status}</span>
      </td>
      <td className="text-left">
        <button className="mr-2" onClick={handleChangeStatus}>
          <FiCheckSquare size={24} color="#131313" />
        </button>
        <button>
          <FiFile size={24} color="#3b82f6" onClick={handleOpenModal} />
        </button>
      </td>
    </tr>
  );
};

export default TicketRow;
