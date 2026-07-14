import { MemoAccordionSection } from "./memo-accordion-section"
import type { RecognitionBoardSectionData } from "../types"

type RecognitionBoardSectionProps = {
  data: RecognitionBoardSectionData
}

export function RecognitionBoardSection({ data }: RecognitionBoardSectionProps) {
  return (
    <MemoAccordionSection
      title="Recognition board"
      badgeText={data.badgeText}
      badgeClassName="bg-success-muted text-success-muted-foreground border-success/30"
      rightLabel={data.rightLabel}
    >
      <ul className="text-muted-foreground list-disc space-y-1 px-8 py-4 text-sm">
        {data.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </MemoAccordionSection>
  )
}
