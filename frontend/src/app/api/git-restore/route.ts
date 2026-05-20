import { NextResponse } from "next/server";
import { execSync } from "child_process";
import fs from "fs";

export const dynamic = "force-static";

export async function GET() {
  try {
    console.log("Git restore API invoked. Extracting original file...");
    let content = "";
    try {
      content = execSync("git show HEAD:frontend/src/app/bulk-orders/page.tsx", {
        cwd: "c:\\web",
        encoding: "utf8"
      });
    } catch (e1: any) {
      content = execSync("git show HEAD:src/app/bulk-orders/page.tsx", {
        cwd: "c:\\web\\frontend",
        encoding: "utf8"
      });
    }

    fs.writeFileSync("c:\\web\\git_backup.txt", content, "utf8");
    console.log("Successfully wrote git_backup.txt");
    return NextResponse.json({ success: true, message: "Backup written to c:\\web\\git_backup.txt" });
  } catch (error: any) {
    fs.writeFileSync("c:\\web\\git_backup.txt", "ERROR: " + error.message, "utf8");
    return NextResponse.json({ success: false, error: error.message });
  }
}
