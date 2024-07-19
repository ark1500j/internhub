// "use client";

// import { CircleX } from "lucide-react";
// import { InputOTPControlled } from "../cards/otpcard";
// import ResetFormCard from "../cards/resetformcard";
// interface Props {
//   isModalOpen?: boolean;
//   handleCloseModal: () => void;
// }
// const ResetModal = ({ isModalOpen, handleCloseModal }: Props) => {
//   const [resetKey] = useRestPassword();
//   return (
//     <div className="flex items-center justify-center">
//       <div
//         className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-35 transform ${
//           isModalOpen ? "scale-100" : "scale-0"
//         } transition-transform duration-300`}
//       >
//         {/* Modal content */}

//         <div className="bg-white rounded-sm w-1/2 h-96 relative">
//           <div
//             onClick={handleCloseModal}
//             className="cursor-pointer absolute top-3 left-6"
//           >
//             <CircleX />
//           </div>
//           <div className="flex items-center justify-center h-full">
//             {!resetKey ? <InputOTPControlled /> : <ResetFormCard />}
//           </div>
//         </div>
//       </div>
      
//     </div>
//   );
// };

// export default ResetModal;
