import { Container } from "@/components/ui";
import { HeaderSkeleton, MediaGridSkeleton } from "@/components/ui/skeletons";

export default function Loading() {
  return (
    <div className="bg-page">
      <HeaderSkeleton />
      <Container className="px-5 py-10 sm:px-8 lg:px-12">
        <MediaGridSkeleton count={6} />
      </Container>
    </div>
  );
}
