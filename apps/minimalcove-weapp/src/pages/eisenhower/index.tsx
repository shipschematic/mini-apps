import { useEffect, useState, useCallback } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { View, Text, ScrollView, Input, Button, Checkbox } from '@tarojs/components'
import { useAppDispatch, useAppSelector } from '../../store'
import store from '../../store'
import { eisenhowerActions, loadEisenhowerTasksAsync, saveEisenhowerTasksAsync } from '../../store/eisenhowerSlice'
import { kanbanActions, saveKanbanTasksAsync } from '../../store/kanbanSlice'
import {
  EisenhowerTask,
  createEisenhowerTask,
  getEisenhowerQuadrant,
  eisenhowerTaskCopyWith
} from '../../models/eisenhowerTaskModel'
import { createTask } from '../../models/taskModel'
import {
  EisenhowerQuadrant,
  quadrantNames,
  quadrantDescriptions,
  getQuadrantColor,
  getQuadrantInkColor,
  getQuadrantName
} from '../../config/eisenhowerConfig'
import { getDefaultColumn } from '../../config/kanbanConfig'
import EisenhowerTaskCard from '../../components/EisenhowerTaskCard'
import './index.css'

interface QuadrantProps {
  quadrant: EisenhowerQuadrant
  tasks: EisenhowerTask[]
  onTaskMoved: (task: EisenhowerTask, newQuadrant: EisenhowerQuadrant) => void
  onTaskDeleted: (task: EisenhowerTask) => void
  onTaskToggled: (task: EisenhowerTask) => void
  onTaskEdited: (task: EisenhowerTask, newTitle: string) => void
  onTasksPasted: (text: string, isUrgent: boolean, isImportant: boolean) => void
}

const Quadrant: React.FC<QuadrantProps> = ({
  quadrant,
  tasks,
  onTaskMoved,
  onTaskDeleted,
  onTaskToggled,
  onTaskEdited,
  onTasksPasted
}) => {
  const [draggedTask, setDraggedTask] = useState<EisenhowerTask | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragStart = (task: EisenhowerTask) => {
    setDraggedTask(task)
  }

  const handleDragEnd = () => {
    setDraggedTask(null)
    setIsDragOver(false)
  }

  const handleDrop = () => {
    if (draggedTask) {
      onTaskMoved(draggedTask, quadrant)
    }
    setIsDragOver(false)
    setDraggedTask(null)
  }

  const handleLongPress = async () => {
    try {
      const res = await Taro.getClipboardData()
      if (res.data && res.data.trim()) {
        const lines = res.data.split('\n').filter((line: string) => line.trim())
        if (lines.length > 0) {
          onTasksPasted(res.data, false, false)
        }
      } else {
        Taro.showToast({ title: 'No text in clipboard', icon: 'none' })
      }
    } catch (error) {
      console.error('Clipboard error:', error)
    }
  }

  const quadrantColor = getQuadrantColor(quadrant)
  const quadrantInk = getQuadrantInkColor(quadrant)
  const taskCount = tasks.length

  return (
    <View
      className={`eisenhower-quadrant ${isDragOver ? 'drag-over' : ''}`}
      style={{ borderColor: isDragOver ? quadrantColor : undefined }}
      onTouchEnd={handleDrop}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragOver(true)
      }}
      onDragLeave={() => setIsDragOver(false)}
      onLongPress={handleLongPress}
    >
      <View className='quadrant-header' style={{ backgroundColor: quadrantColor }}>
        <Text className='quadrant-name' style={{ color: quadrantInk }}>{quadrantNames[quadrant]}</Text>
        <Text className='quadrant-subtitle' style={{ color: quadrantInk }}>{quadrantDescriptions[quadrant]}</Text>
        <Text className='quadrant-count' style={{ color: quadrantInk }}>({taskCount})</Text>
      </View>

      <ScrollView scrollY className='quadrant-content'>
        {tasks.map(task => (
          <View
            key={task.id}
            className={`task-wrapper ${draggedTask?.id === task.id ? 'dragging' : ''}`}
            draggable
            onDragStart={() => handleDragStart(task)}
            onDragEnd={handleDragEnd}
          >
            <EisenhowerTaskCard
              task={task}
              quadrant={quadrant}
              onTaskDeleted={() => onTaskDeleted(task)}
              onTaskToggled={() => onTaskToggled(task)}
              onTaskEdited={(newTitle) => onTaskEdited(task, newTitle)}
            />
          </View>
        ))}

        {tasks.length === 0 && (
          <View className='empty-quadrant'>
            <Text className='empty-quadrant-text'>Long press to paste tasks</Text>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const EisenhowerScreen: React.FC = () => {
  const eisenhowerState = useAppSelector(state => state.eisenhower)
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [taskTitle, setTaskTitle] = useState('')
  const [isUrgent, setIsUrgent] = useState(false)
  const [isImportant, setIsImportant] = useState(false)
  const [editTask, setEditTask] = useState<EisenhowerTask | null>(null)
  const [showTransferDialog, setShowTransferDialog] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  useDidShow(() => {
    loadTasks()
  })

  const loadTasks = useCallback(() => {
    setIsLoading(true)
    dispatch(loadEisenhowerTasksAsync())
    setTimeout(() => {
      setIsLoading(false)
    }, 100)
  }, [dispatch])

  const showToast = (message: string) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(null), 2000)
  }

  const getTasksByQuadrant = (quadrant: EisenhowerQuadrant): EisenhowerTask[] => {
    return eisenhowerState.tasks.filter(
      task => getEisenhowerQuadrant(task) === quadrant
    )
  }

  const handleAddTask = () => {
    setEditTask(null)
    setTaskTitle('')
    setIsUrgent(false)
    setIsImportant(false)
    setShowDialog(true)
  }

  const handleDialogSubmit = () => {
    if (taskTitle.trim()) {
      if (editTask) {
        const updatedTask = eisenhowerTaskCopyWith(editTask, {
          title: taskTitle.trim(),
          isUrgent,
          isImportant
        })
        dispatch(eisenhowerActions.updateTask(updatedTask))
        dispatch(saveEisenhowerTasksAsync())
        showToast('Task updated!')
      } else {
        const newTask = createEisenhowerTask({
          title: taskTitle.trim(),
          isUrgent,
          isImportant
        })
        dispatch(eisenhowerActions.addTask(newTask))
        dispatch(saveEisenhowerTasksAsync())
        showToast('Task added!')
      }
    }
    setShowDialog(false)
    setTaskTitle('')
    setEditTask(null)
  }

  const handleTaskMoved = (task: EisenhowerTask, newQuadrant: EisenhowerQuadrant) => {
    dispatch(eisenhowerActions.moveTaskToQuadrant(task.id, newQuadrant))
    dispatch(saveEisenhowerTasksAsync())
  }

  const handleTaskDeleted = (task: EisenhowerTask) => {
    dispatch(eisenhowerActions.deleteTask(task.id))
    dispatch(saveEisenhowerTasksAsync())
    showToast('Task deleted!')
  }

  const handleTaskToggled = (task: EisenhowerTask) => {
    dispatch(eisenhowerActions.markTaskCompleted(task.id))
    dispatch(saveEisenhowerTasksAsync())
  }

  const handleTaskEdited = (task: EisenhowerTask, newTitle: string) => {
    setEditTask(task)
    setTaskTitle(newTitle)
    setIsUrgent(task.isUrgent)
    setIsImportant(task.isImportant)
    setShowDialog(true)
  }

  const handleTasksPasted = (text: string, isUrgent: boolean, isImportant: boolean) => {
    const lines = text.split('\n').filter(line => line.trim())
    const newTasks: EisenhowerTask[] = lines.map((line, index) =>
      createEisenhowerTask({
        title: line.trim(),
        isUrgent,
        isImportant,
        id: `${Date.now()}_${index}`
      })
    )
    dispatch(eisenhowerActions.addBulkTasks(newTasks))
    dispatch(saveEisenhowerTasksAsync())
    showToast(`Added ${newTasks.length} task(s)!`)
  }

  const handleTransferDoFirst = () => {
    const doFirstTasks = getTasksByQuadrant(EisenhowerQuadrant.UrgentImportant)
    if (doFirstTasks.length === 0) {
      showToast('No "Do First" tasks to transfer')
      return
    }
    setShowTransferDialog(true)
  }

  const confirmTransfer = () => {
    const doFirstTasks = getTasksByQuadrant(EisenhowerQuadrant.UrgentImportant)

    doFirstTasks.forEach(eisenhowerTask => {
      const kanbanTask = createTask({
        id: eisenhowerTask.id,
        title: eisenhowerTask.title,
        isCompleted: eisenhowerTask.isCompleted,
        isHighPriority: eisenhowerTask.isHighPriority || (eisenhowerTask.isUrgent && eisenhowerTask.isImportant),
        column: getDefaultColumn()
      })
      dispatch(kanbanActions.addTask(kanbanTask))
    })

    dispatch(eisenhowerActions.removeTasksByQuadrant(EisenhowerQuadrant.UrgentImportant))
    dispatch(saveKanbanTasksAsync())
    dispatch(saveEisenhowerTasksAsync())

    showToast(`Transferred ${doFirstTasks.length} task(s) to Kanban!`)
    setShowTransferDialog(false)
  }

  if (isLoading) {
    return (
      <View className='eisenhower-screen loading'>
        <Text className='loading-text'>Loading...</Text>
      </View>
    )
  }

  return (
    <View className='eisenhower-screen'>
      <View className='eisenhower-header'>
        <View className='header-content'>
          <Text className='eisenhower-title'>Eisenhower Matrix</Text>
          <Text className='eisenhower-subtitle'>Urgent vs Important</Text>
        </View>
        <View className='header-actions'>
          <View className='eisenhower-add-btn' onClick={handleAddTask}>
            <Text className='eisenhower-add-btn-text'>+ Add</Text>
          </View>
          <View className='eisenhower-transfer-btn' onClick={handleTransferDoFirst}>
            <Text className='eisenhower-transfer-btn-text'>Transfer Do First</Text>
          </View>
        </View>
      </View>

      <ScrollView scrollY className='eisenhower-board'>
        <View className='quadrant-grid'>
          <Quadrant
            quadrant={EisenhowerQuadrant.UrgentImportant}
            tasks={getTasksByQuadrant(EisenhowerQuadrant.UrgentImportant)}
            onTaskMoved={handleTaskMoved}
            onTaskDeleted={handleTaskDeleted}
            onTaskToggled={handleTaskToggled}
            onTaskEdited={handleTaskEdited}
            onTasksPasted={handleTasksPasted}
          />
          <Quadrant
            quadrant={EisenhowerQuadrant.NotUrgentImportant}
            tasks={getTasksByQuadrant(EisenhowerQuadrant.NotUrgentImportant)}
            onTaskMoved={handleTaskMoved}
            onTaskDeleted={handleTaskDeleted}
            onTaskToggled={handleTaskToggled}
            onTaskEdited={handleTaskEdited}
            onTasksPasted={handleTasksPasted}
          />
          <Quadrant
            quadrant={EisenhowerQuadrant.UrgentNotImportant}
            tasks={getTasksByQuadrant(EisenhowerQuadrant.UrgentNotImportant)}
            onTaskMoved={handleTaskMoved}
            onTaskDeleted={handleTaskDeleted}
            onTaskToggled={handleTaskToggled}
            onTaskEdited={handleTaskEdited}
            onTasksPasted={handleTasksPasted}
          />
          <Quadrant
            quadrant={EisenhowerQuadrant.NotUrgentNotImportant}
            tasks={getTasksByQuadrant(EisenhowerQuadrant.NotUrgentNotImportant)}
            onTaskMoved={handleTaskMoved}
            onTaskDeleted={handleTaskDeleted}
            onTaskToggled={handleTaskToggled}
            onTaskEdited={handleTaskEdited}
            onTasksPasted={handleTasksPasted}
          />
        </View>
      </ScrollView>

      {showDialog && (
        <View className='dialog-overlay'>
          <View className='dialog'>
            <Text className='dialog-title'>{editTask ? 'Edit Task' : 'Add New Task'}</Text>
            <Input
              className='dialog-input'
              style='height: 88rpx; min-height: 88rpx; font-size: 28rpx;'
              value={taskTitle}
              onInput={e => setTaskTitle(e.detail.value)}
              placeholder='Task name'
              placeholderClass='dialog-input-placeholder'
              focus
            />
            <View className='checkbox-group'>
              <View className='checkbox-item' onClick={() => setIsUrgent(!isUrgent)}>
                <Checkbox checked={isUrgent} />
                <Text className='checkbox-label'>Urgent</Text>
              </View>
              <View className='checkbox-item' onClick={() => setIsImportant(!isImportant)}>
                <Checkbox checked={isImportant} />
                <Text className='checkbox-label'>Important</Text>
              </View>
            </View>
            <View className='dialog-actions'>
              <Button className='dialog-btn cancel' onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button className='dialog-btn submit' onClick={handleDialogSubmit}>
                {editTask ? 'Save' : 'Add Task'}
              </Button>
            </View>
          </View>
        </View>
      )}

      {showTransferDialog && (
        <View className='dialog-overlay'>
          <View className='dialog'>
            <Text className='dialog-title'>Transfer Tasks</Text>
            <Text className='dialog-content'>
              Transfer {getTasksByQuadrant(EisenhowerQuadrant.UrgentImportant).length} "Do First" task(s) to Kanban "To Do" column?
            </Text>
            <View className='dialog-actions'>
              <Button className='dialog-btn cancel' onClick={() => setShowTransferDialog(false)}>
                Cancel
              </Button>
              <Button className='dialog-btn submit' onClick={confirmTransfer}>
                Transfer
              </Button>
            </View>
          </View>
        </View>
      )}

      {toastMessage && (
        <View className='toast'>
          <Text className='toast-text'>{toastMessage}</Text>
        </View>
      )}
    </View>
  )
}

export default EisenhowerScreen
