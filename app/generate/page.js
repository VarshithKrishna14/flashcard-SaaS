'use client';

import { useUser } from "@clerk/nextjs";
import { Box, Container, Paper, TextField, Typography, Button, Grid, Card, CardActionArea, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getFirestore, writeBatch, doc, collection, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { color } from "framer-motion";

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  const handleSubmit = async () => {
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ text }),
        headers: { 'Content-Type': 'application/json' },
      });

      const contentType = res.headers.get('Content-Type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const textResponse = await res.text();
        try {
          const jsonString = textResponse.match(/\[.*\]/s);
          if (jsonString) {
            data = JSON.parse(jsonString[0]);
          } else {
            data = [{ question: "Error", answer: "Invalid response format." }];
          }
        } catch (error) {
          console.error('Error parsing response:', error);
          data = [{ question: "Error", answer: "Invalid response format." }];
        }
      }

      if (Array.isArray(data) && data.every(item => item.question && item.answer)) {
        setFlashcards(data);
      } else {
        console.error('Received invalid data:', data);
        setFlashcards([{ question: "Error", answer: "Received invalid data from the server." }]);
      }
    } catch (error) {
      console.error('Error during fetch:', error);
      setFlashcards([{ question: "Error", answer: "An error occurred. Please try again." }]);
    }
  };

  const handleCardClick = (index) => {
    setFlipped(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const saveFlashcards = async () => {
    if (!name) {
      alert('Please enter a name');
      return;
    }

    const batch = writeBatch(db);
    const userDocRef = doc(collection(db, 'users'), user.id);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const collections = docSnap.data().flashcards || [];
      if (collections.find((f) => f.name === name)) {
        alert("Flashcard collection with this name already exists.");
        return;
      } else {
        collections.push({ name });
        batch.set(userDocRef, { flashcards: collections }, { merge: true });
      }
    } else {
      batch.set(userDocRef, { flashcards: [{ name }] });
    }

    const colRef = collection(userDocRef, name);
    flashcards.forEach((flashcard) => {
      const cardDocRef = doc(colRef);
      batch.set(cardDocRef, flashcard);
    });

    await batch.commit();
    handleClose();
    router.push('/flashcards');
  };

  return (
    <Container maxWidth="100%" sx={{ bgcolor: 'grey', color: '#e0e0e0', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', px: 2 }}>
      <Box sx={{ mt: 4, mb: 6, width: '100%', maxWidth: '800px' }}>
        <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }} fontFamily={"-moz-initial"} fontSize={"50px"}>Generate Flashcards</Typography>
        <Paper sx={{ p: 4, bgcolor: '#333', color: '#e0e0e0' }}>
          <TextField
            value={text}
            onChange={(e) => setText(e.target.value)}
            label="Enter your text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            sx={{ mb: 2, input: { color: '#fff' }, textarea: { color: '#fff' }, bgcolor: '#444' }}
          />
          <Button
  variant="contained"
  color="primary"
  onClick={handleSubmit}
  sx={{
    backgroundColor: '#ff6f61',
    '&:hover': { backgroundColor: '#ff3b2a' },
    position: 'relative',
    overflow: 'hidden',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '2px',
      backgroundColor: '#fff',
      transform: 'scaleX(0)',
      transformOrigin: 'bottom right',
      transition: 'transform 0.3s ease-out',
    },
    '&:hover::after': {
      transform: 'scaleX(1)',
      transformOrigin: 'bottom left',
    },
  }}
>
  Generate Flashcards
</Button>

        </Paper>
      </Box>

      {flashcards.length > 0 && (
        <Box sx={{ mt: 4, width: '100%', maxWidth: '800px' }}>
          <Typography variant="h5" sx={{ mb: 4, textAlign: 'center' }}>Flashcards Preview</Typography>
          <Grid container spacing={3}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ bgcolor: '#1e1e1e', color: '#e0e0e0' }}>
                  <CardActionArea onClick={() => handleCardClick(index)}>
                    <CardContent>
                      <Box sx={{
                        perspective: '1000px',
                        '& > div': {
                          transition: 'transform 0.6s',
                          transformStyle: 'preserve-3d',
                          position: 'relative',
                          width: '100%',
                          height: '200px',
                          boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                          transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)'
                        },
                        '& > div > div': {
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          backfaceVisibility: 'hidden',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: 2,
                          boxSizing: 'border-box'
                        },
                        '& > div > div:nth-of-type(2)': {
                          transform: 'rotateY(180deg)'
                        }
                      }}>
                        <div style={{backgroundColor:"black"}}>
                          <div>
                            <Typography variant="h6" component="div">
                              {flashcard.question}
                            </Typography>
                          </div>
                          <div>
                            <Typography variant="h6" component="div" sx={{height:'200px', overflow:"auto"}}>
                              {flashcard.answer}
                            </Typography>
                          </div>
                        </div>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" color="secondary" onClick={handleOpen} sx={{ backgroundColor: '#ff6f61', '&:hover': { backgroundColor: '#ff3b2a' } }}>
              Save Flashcards
            </Button>
          </Box>
        </Box>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Save Flashcards</DialogTitle>
        <DialogContent>
          <DialogContentText>Please enter a name for your flashcards collection</DialogContentText>
          <TextField autoFocus margin="dense" label="Collection Name" type="text" fullWidth value={name} onChange={(e) => setName(e.target.value)} variant="outlined" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={saveFlashcards}>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
