import { CircleX } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { ApplyInternshipAction } from "@/app/action";
import { useState } from "react";
import toast from "react-hot-toast";

interface Props {
  isModalOpen?: boolean;
  handleCloseModal: () => void;
  postid: string | null;
}

const ApplicationModal = ({ isModalOpen, handleCloseModal, postid }: Props) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true); // Set loading state to true
    const res = await ApplyInternshipAction(postid as string, message);
    setLoading(false); // Set loading state to false after submission
    if(res?.sucess){
      handleCloseModal()
      toast.success(res.message)
    }
  };

  return (
    <div className="flex items-center justify-center relative z-50">
      <div
        className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-35 transform ${
          isModalOpen ? "scale-100" : "scale-0"
        } transition-transform duration-300`}
      >
        {/* Modal content */}
        <div className="bg-white rounded-sm w-1/2 h-96 relative">
          <div
            onClick={handleCloseModal}
            className="cursor-pointer absolute top-3 left-6"
          >
            <CircleX />
          </div>
          <form
            className="flex items-start justify-center gap-2 px-24 h-full flex-col"
            onSubmit={handleSubmit}
          >
            <h2>Your message to employer</h2>
            <Textarea
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              value={message}
              className=""
            />
            <Button
              type="submit"
              className="mt-2 bg-purple-500"
              disabled={loading} // Disable the button when loading
            >
              {loading ? "Loading..." : "Apply"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export { ApplicationModal };
