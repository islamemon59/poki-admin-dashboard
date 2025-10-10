import { FaTrashAlt } from "react-icons/fa";

const DeleteButton = ({id, onDelete}) => {

  return (
    <button
      onClick={() => onDelete(id)}
      className="bg-red-500 hover:bg-red-600 p-2 rounded-full transition"
      title="Delete"
    >
      <FaTrashAlt className="text-white" />
    </button>
  );
};

export default DeleteButton;
