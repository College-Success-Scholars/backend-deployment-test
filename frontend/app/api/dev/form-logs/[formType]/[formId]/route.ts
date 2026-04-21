import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Params = {
  formType: string;
  formId: string;
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<Params> }
) {
  const { formType, formId } = await params;
  const supabase = await createClient();

  if (formType === "mcf") {
    const { data, error } = await supabase
      .from("mcf_form_logs")
      .select("*")
      .eq("id", formId)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: "MCF submission not found." }, { status: 404 });
    }
    return NextResponse.json({ data });
  }

  if (formType === "wpl") {
    const numericId = Number(formId);
    if (Number.isNaN(numericId)) {
      return NextResponse.json({ error: "Invalid WPL ID." }, { status: 400 });
    }
    const { data, error } = await supabase
      .from("wpl_form_logs")
      .select("*")
      .eq("id", numericId)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: "WPL submission not found." }, { status: 404 });
    }
    return NextResponse.json({ data });
  }

  return NextResponse.json({ error: "Unsupported form type." }, { status: 400 });
}
