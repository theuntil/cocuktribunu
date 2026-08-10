import { HeaderSkeleton, CardGridSkeleton } from "@/components/ui/skeletons";
import { Container } from "@/components/ui";

export default function Loading() {
  return (
    <div className="bg-page">
      <HeaderSkeleton />
      <Container className="px-5 py-12 sm:px-8 lg:px-12">
        <CardGridSkeleton count={6} />
      </Container>
    </div>
  );
}
