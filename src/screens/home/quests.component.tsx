import { useState } from "react"
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"

export const Quests = ({ isOpen, onClose }: any) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Quest Details
          <ModalCloseButton />
        </ModalHeader>

        <ModalBody>
          <Card className='bg-background'>
            <CardHeader className='space-y-1'>
              <CardTitle className='text-2xl'>Quest Title</CardTitle>
              <CardDescription>Quest Description</CardDescription>
            </CardHeader>
            <CardContent className='grid gap-4'>
              {/* Add content for the quest card as needed */}
            </CardContent>
          </Card>
        </ModalBody>

        <ModalFooter>
          {/* Add additional buttons or controls if needed */}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
