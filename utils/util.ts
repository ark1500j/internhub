import { UTApi } from "uploadthing/server";

export const utapi = new UTApi();

export function capitalizeFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
export function stripHtml(html: string): string {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || "";
}

export function truncateString(str: string, num: number): string {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + "...";
}
export const getStatusClass = (status: string) => {
  switch (status) {
    case "review":
      return "bg-purple-300 px-2";
    case "hired":
      return "bg-green-300 px-4";
    case "rejected":
      return "bg-red-400";
    default:
      return "";
  }
};
