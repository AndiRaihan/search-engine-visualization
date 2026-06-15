import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface ResetScenarioDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export const ResetScenarioDialog: React.FC<ResetScenarioDialogProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-secondary border border-border-custom rounded-[12px] p-lg max-w-md">
        <AlertDialogHeader className="text-left">
          <AlertDialogTitle className="text-heading font-weight-bold text-primary-text">
            Reset edited scenario?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-body text-muted-text mt-sm">
            This will discard your query and document edits and return to the setup step.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-xl flex gap-sm justify-end">
          <AlertDialogCancel
            autoFocus
            className="min-h-[44px] px-lg font-weight-bold rounded-[4px] border border-border-custom text-primary-text bg-secondary hover:bg-subtle-surface cursor-pointer"
          >
            Keep edits
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="min-h-[44px] px-lg font-weight-bold rounded-[4px] bg-destructive-fill hover:bg-destructive-fill/90 text-accent-contrast cursor-pointer"
          >
            Reset scenario
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
