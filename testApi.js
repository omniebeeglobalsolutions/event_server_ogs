async function test() {
  try {
    const res = await fetch('https://event-server-ogs.onrender.com/api/events');
    const data = await res.json();
    console.log("API Response Status:", res.status);
    console.log("Number of events:", data.length);
    console.log("First event:", JSON.stringify(data[0], null, 2));
  } catch (error) {
    console.error("API Call failed:", error);
  }
}
test();
