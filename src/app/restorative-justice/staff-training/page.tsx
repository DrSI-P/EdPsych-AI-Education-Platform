'use client';

// import React from 'react'; // Unused import
import { Box, Container, Heading, Text } from '@chakra-ui/react';
import StaffTrainingModules from '@/components/restorative-justice/staff-training/staff-training-modules';
import { useSession } from 'next-auth/react';
import AccessDenied from '@/components/common/access-denied';

export default function StaffTrainingPage() : React.ReactNode {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';
  
  // Check if user is authenticated
  if (!session && !isLoading) {
    return <AccessDenied />;
  }
  
  return (
    <Container maxW="container.xl" py={8}>
      <Box mb={8}>
        <Heading as="h1" size="xl" mb={4}>Staff Training on Restorative Approaches</Heading>
        <Text fontSize="lg">
          Evidence-based professional development resources to support educators in effectively implementing 
          restorative practices in educational settings. These comprehensive modules are designed to build 
          knowledge, skills, and confidence in using restorative approaches to create positive school communities.
        </Text>
      </Box>
      
      <StaffTrainingModules />
    </Container>
  );
}
