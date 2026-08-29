import { NextRequest, NextResponse } from "next/server";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { execFile } from "child_process";
import { promisify } from "util";
import { existsSync } from "fs";

const execFileAsync = promisify(execFile);

export async function POST(request: NextRequest) {
  let tempFilePath: string | null = null;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const businessProblem = (formData.get("business_problem") as string) || "";

    if (!file) {
      return NextResponse.json(
        { status: "error", message: "No dataset file uploaded." },
        { status: 400 }
      );
    }

    if (!businessProblem.trim()) {
      return NextResponse.json(
        { status: "error", message: "Business problem cannot be empty." },
        { status: 400 }
      );
    }

    // Save uploaded file to temp directory
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `upload_${Date.now()}_${file.name}`;
    tempFilePath = join(tmpdir(), fileName);
    await writeFile(tempFilePath, buffer);

    // Locate Python executable and project root
    const workspaceRoot = join(process.cwd(), "..");
    const backendScript = join(workspaceRoot, "backend", "main.py");
    const scriptPath = existsSync(backendScript)
      ? backendScript
      : join(process.cwd(), "backend", "main.py");

    const venvPython = join(workspaceRoot, "venv", "Scripts", "python.exe");
    const pythonExe = existsSync(venvPython)
      ? venvPython
      : process.platform === "win32"
      ? "python"
      : "python3";

    const { stdout } = await execFileAsync(
      pythonExe,
      [scriptPath, "--file", tempFilePath, "--problem", businessProblem],
      {
        maxBuffer: 20 * 1024 * 1024,
      }
    );

    const result = JSON.parse(stdout);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Analysis execution error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Failed to execute analysis.",
      },
      { status: 500 }
    );
  } finally {
    if (tempFilePath && existsSync(tempFilePath)) {
      try {
        await unlink(tempFilePath);
      } catch {}
    }
  }
}
