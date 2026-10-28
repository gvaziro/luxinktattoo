import { NotFoundView } from "@/components/NotFoundView";
import { en } from "@/content/dictionaries/en";

export default function NotFound() {
  return <NotFoundView dict={en.notFound} home="/" />;
}
