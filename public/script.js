document.getElementById("screenshotBtn").addEventListener("click", async () => {
  try {
    const response = await fetch("/screenshot");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const blob = await response.blob();
    // Create a temporary URL for the blob data
    const url = URL.createObjectURL(blob);
    // Create a temporary link element to trigger the download
    const a = document.createElement("a");
    a.href = url;
    a.download = "screenshot.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error taking screenshot:", error);
  }
});
