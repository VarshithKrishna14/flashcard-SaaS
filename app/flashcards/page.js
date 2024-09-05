'use client';

import { useState, useEffect } from 'react';
import { Container, Box, Typography, Grid, Card, CardActionArea, CardContent } from '@mui/material';
import { db } from '@/firebase'; // Adjust the path to your Firebase configuration file
import { collection, doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';  // Correct import for Next.js 13+
import { useAuth } from '@clerk/nextjs';  // Assuming you are using Clerk for authentication

export default function FlashcardsPage() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { userId } = useAuth(); // Get user ID from authentication service

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        if (!userId) {
          console.error('User not authenticated');
          return;
        }

        const userDocRef = doc(db, 'users', userId); // Get user document reference
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          console.log('User document:', userSnap.data());
          const flashcardCollections = userSnap.data().flashcards || [];
          console.log('Flashcard collections:', flashcardCollections);

          setCollections(flashcardCollections);
        } else {
          console.log('User document does not exist.');
        }
      } catch (error) {
        console.error('Error fetching flashcard collections:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, [userId]); // Add userId to dependencies to refetch if it changes

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4">Your Flashcard Collections</Typography>
        {collections.length > 0 ? (
          <Grid container spacing={3}>
            {collections.map((collection, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardActionArea onClick={() => router.push(`/flashcards/${collection.name}`)}>
                    <CardContent>
                      <Typography variant="h6">
                        {collection.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography>No flashcard collections available.</Typography>
        )}
      </Box>
    </Container>
  );
}
