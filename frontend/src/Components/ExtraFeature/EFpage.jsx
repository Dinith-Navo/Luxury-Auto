import React, { useState, useRef, useEffect } from "react";
import { Container, TextField, Button, Card, CardContent, Typography, Box, CircularProgress, IconButton, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material";
import { Mic, MicOff, ContentCopy, Print } from "@mui/icons-material";
import { motion } from "framer-motion";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import jsPDF from "jspdf";
import "jspdf-autotable";

const EFpage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [tableData, setTableData] = useState(null);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onstart = () => setListening(true);
      recognitionRef.current.onend = () => setListening(false);
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };
    }
  }, [messages]);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    } else {
      alert("Voice recognition is not supported in this browser.");
    }
  };

  // Function to convert Markdown table to JSON
  const parseMarkdownTable = (markdown) => {
    const lines = markdown.trim().split("\n");
    if (lines.length < 3) return null; // Not a valid table

    const headers = lines[0].split("|").map((h) => h.trim()).filter((h) => h !== "");
    const rows = lines.slice(2).map((row) =>
      row.split("|").map((col) => col.trim()).filter((col) => col !== "")
    );

    return { headers, rows };
  };


  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const newMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:4000/api/prompt-post", { prompt: input });

      const responseData = response.data.response || "🤖 No response received.";

      if (responseData.includes("|") && responseData.includes("---")) {
        // Extract table from response
        const extractedTable = responseData.substring(responseData.indexOf("|"));
        const parsedTable = parseMarkdownTable(extractedTable);

        if (parsedTable) {
          setTableData(parsedTable);
        } else {
          setMessages((prev) => [...prev, { role: "assistant", content: responseData }]);
          setTableData(null);
        }
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: responseData }]);
        setTableData(null);
      }
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ Error: Unable to fetch response." }]);
      setTableData(null);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const printTable = () => {
    if (!tableData) return;

    const doc = new jsPDF();

    // LUXY Branding
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor( " primary");
    doc.text("Luxury Auto AI SYSTEM", 10, 15);

    // Subtitle
    doc.setFontSize(12);
    doc.setTextColor("#000");
    doc.text("AI-Generated Document", 10, 25);

    // Table
    doc.autoTable({
      startY: 30,
      head: [tableData.headers],
      body: tableData.rows,
      theme: "grid",
      styles: { fontSize: 10, textColor: "#000" },
      headStyles: { fillColor: "#0062ff", textColor: "#000", fontStyle: "bold" },
      alternateRowStyles: { fillColor: "#cecece" },
    });

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    doc.setTextColor("#555");
    doc.text("© 2025 LUXY", 10, pageHeight - 10);

    doc.save("LUXY_Table.pdf");
  };



  return (
    <Container maxWidth="md" sx={{ mt: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Card sx={{ width: "100%", maxWidth: "900px", p: 2, borderRadius: 3, boxShadow: 5, bgcolor: " #cecece" }}>
        <CardContent>
          <Typography variant="h4" sx={{ textAlign: "center", fontWeight: "bold", color: " #0062ff" }}>
            Luxy
          </Typography>
          <Typography variant="h6" sx={{ textAlign: "center", color: "gray", mb: 2 }}>
            Your Virtual Assistant
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              maxHeight: 400,
              overflowY: "auto",
              p: 1,
            }}
          >
            {/* If there's table data, show it */}
            {tableData ? (
              <>
                <Button variant="contained" sx={{ mb: 2, bgcolor: " #0062ff" }} startIcon={<Print />} onClick={printTable}>
                  Print PDF
                </Button>
                <Table sx={{ bgcolor: "white", borderRadius: 2 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#0062ff" }}>
                      {tableData.headers.map((header, index) => (
                        <TableCell key={index}><strong>{header}</strong></TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tableData.rows.map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <TableCell key={cellIndex}>{cell}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            ) : (
              messages.map((msg, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                  <Typography sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: msg.role === "user" ? "#0062ff" : "rgb(255, 255, 255)",
                    color: msg.role === "user" ? "#000000" : "#000000",
                    maxWidth: "80%",
                  }}>
                    <strong>{msg.role === "user" ? "You" : "LUXY"}:</strong> <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </Typography>
                </motion.div>
              ))
            )}

            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <Typography sx={{ color: "gray", alignSelf: "flex-start" }}>🤖 LUXY is typing...</Typography>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </Box>
        </CardContent>
      </Card>
      <Box sx={{ display: "flex", width: "100%", maxWidth: 600, mt: 2, alignItems: "center" }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Type or speak..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={loading}
        />
        <IconButton sx={{ ml: 1, bgcolor: listening ? "red" : "#0062ff", color: "#000000" }} onClick={startListening}>
          {listening ? <MicOff /> : <Mic />}
        </IconButton>
        <Button variant="contained" sx={{ ml: 1, bgcolor: "#0062ff", color: "#000000" }} onClick={sendMessage} disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : "Send"}
        </Button>
      </Box>
    </Container>
  );
};

export default EFpage;
