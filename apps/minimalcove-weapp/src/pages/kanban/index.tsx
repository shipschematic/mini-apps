import { useState, useCallback } from 'react'
import { useDidShow } from '@tarojs/taro'
import { View, Text, ScrollView, Input } from '@tarojs/components'
import { useAppDispatch, useAppSelector } from '../../store'
import { kanbanActions, loadKanbanTasksAsync, saveKanbanTasksAsync } from '../../store/kanbanSlice'
import { Task, createTask } from '../../models/taskModel'
import {
  KANBAN_COLUMNS,
  getWipLimit,
  getColumnColor,
  getColumnInkColor
} from '../../config/kanbanConfig'
import type { KanbanColumn as KanbanColumnName } from '../../config/kanbanConfig'
import './index.css'

interface KanbanColumnProps {
  title: KanbanColumnName
  tasks: Task[]
  wipLimit: number | null
  onTaskTap: (task: Task) => void
  onAddTask: (column: string) => void
  onTaskMove: (task: Task) => void
  onTaskDeleted: (taskId: string) => void
  onTaskPriorityChanged: (taskId: string, isHighPriority: boolean) => void
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  tasks,
  wipLimit,
  onTaskTap,
  onAddTask,
  onTaskMove,
  onTaskDeleted,
  onTaskPriorityChanged
}) => {
  const [isDragOver, setIsDragOver] = useState(false)

  const color = getColumnColor(title)
  const ink = getColumnInkColor(title)

  const incompleteTasks = tasks.filter(t => !t.isCompleted)
  const completedTasks = tasks.filter(t => t.isCompleted)

  const handleDragOver = () => {
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = () => {
    setIsDragOver(false)
  }

  return (
    <View
      className={`kanban-column ${isDragOver ? 'drag-over' : ''}`}
      onTouchEnd={handleDrop}
    >
      <View className='column-header' style={{ backgroundColor: color }}>
        <View className='column-title-row'>
          <Text className='column-title-text' style={{ color: ink }}>{title}</Text>
          <Text className='column-count' style={{ color: ink }}>
            {incompleteTasks.length}{wipLimit != null ? `/${wipLimit}` : ''}
          </Text>
        </View>
        {title === 'To Do' && (
          <View
            className='add-btn'
            style={{ backgroundColor: ink === '#432818' ? 'rgba(67, 40, 24, 0.16)' : 'rgba(255, 255, 255, 0.2)' }}
            onClick={() => onAddTask(title)}
          >
            <Text className='add-btn-text' style={{ color: ink }}>+</Text>
          </View>
        )}
      </View>

      <ScrollView scrollY className='column-content'>
        {incompleteTasks.map(task => (
          <View
            key={task.id}
            className='task-item'
            onClick={() => onTaskTap(task)}
          >
            <View className='task-content'>
              {task.isHighPriority && (
                <Text className='priority-flag'>⚑</Text>
              )}
              <Text className='task-title'>{task.title}</Text>
            </View>
            <View className='task-buttons'>
              <View
                className='task-btn priority-btn'
                onClick={(e) => {
                  e.stopPropagation()
                  onTaskPriorityChanged(task.id, !task.isHighPriority)
                }}
              >
                <Text className={`task-btn-icon ${task.isHighPriority ? 'active' : ''}`}>★</Text>
              </View>
              <View
                className='task-btn move-btn'
                onClick={(e) => {
                  e.stopPropagation()
                  onTaskMove(task)
                }}
              >
                <Text className='task-btn-icon'>→</Text>
              </View>
              <View
                className='task-btn edit-btn'
                onClick={(e) => {
                  e.stopPropagation()
                  onTaskTap(task)
                }}
              >
                <Text className='task-btn-icon'>✎</Text>
              </View>
              <View
                className='task-btn delete-btn'
                onClick={(e) => {
                  e.stopPropagation()
                  onTaskDeleted(task.id)
                }}
              >
                <Text className='task-btn-icon'>✕</Text>
              </View>
            </View>
          </View>
        ))}

        {completedTasks.length > 0 && (
          <View className='completed-section'>
            <Text className='completed-header'>Completed ({completedTasks.length})</Text>
            {completedTasks.map(task => (
              <View
                key={task.id}
                className='task-item completed-task'
                onClick={() => onTaskTap(task)}
              >
                <Text className='task-title strikethrough'>{task.title}</Text>
                <View
                  className='task-btn move-btn'
                  onClick={(e) => {
                    e.stopPropagation()
                    onTaskMove(task)
                  }}
                >
                  <Text className='task-btn-icon'>→</Text>
                </View>
                <View
                  className='task-btn delete-btn'
                  onClick={(e) => {
                    e.stopPropagation()
                    onTaskDeleted(task.id)
                  }}
                >
                  <Text className='task-btn-icon'>✕</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {tasks.length === 0 && (
          <View className='empty-column'>
            <Text className='empty-text'>No tasks</Text>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const KanbanScreen: React.FC = () => {
  const kanbanState = useAppSelector(state => state.kanban)
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [dialogType, setDialogType] = useState<'add' | 'edit'>('add')
  const [dialogColumn, setDialogColumn] = useState<string>('To Do')
  const [taskTitle, setTaskTitle] = useState('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [pendingMoveTask, setPendingMoveTask] = useState<Task | null>(null)

  useDidShow(() => {
    loadTasks()
  })

  const loadTasks = useCallback(() => {
    setIsLoading(true)
    dispatch(loadKanbanTasksAsync())
    setTimeout(() => {
      setIsLoading(false)
    }, 100)
  }, [dispatch])

  const showToast = (message: string) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(null), 2000)
  }

  const handleTaskTap = (task: Task) => {
    if (task.isCompleted) {
      return
    }
    setSelectedTask(task)
    setDialogType('edit')
    setTaskTitle(task.title)
    setShowDialog(true)
  }

  const handleTaskMoved = (taskId: string, targetColumn: KanbanColumnName) => {
    const task = kanbanState.tasks.find(t => t.id === taskId)
    if (!task || task.column === targetColumn) {
      return
    }

    const targetCount = kanbanState.tasks.filter(
      t => t.column === targetColumn && !t.isCompleted
    ).length
    const limit = getWipLimit(targetColumn)
    if (targetColumn !== 'Done' && limit != null && targetCount >= limit) {
      showToast(`${targetColumn} is at its WIP limit (${limit})`)
      return
    }

    dispatch(kanbanActions.moveTask({ taskId, targetColumn }))
    dispatch(saveKanbanTasksAsync())
    showToast(`Moved to ${targetColumn}`)
  }

  const handleTaskMoveRequest = (task: Task) => {
    setPendingMoveTask(task)
  }

  const handleMoveToColumn = (targetColumn: KanbanColumnName) => {
    if (!pendingMoveTask) {
      return
    }
    handleTaskMoved(pendingMoveTask.id, targetColumn)
    setPendingMoveTask(null)
  }

  const handleTaskDeleted = (taskId: string) => {
    dispatch(kanbanActions.deleteTask(taskId))
    dispatch(saveKanbanTasksAsync())
  }

  const handleTaskPriorityChanged = (taskId: string, isHighPriority: boolean) => {
    dispatch(kanbanActions.setTaskPriority({ taskId, isHighPriority }))
    dispatch(saveKanbanTasksAsync())
  }

  const handleAddTask = (column: string) => {
    setDialogColumn(column)
    setDialogType('add')
    setTaskTitle('')
    setShowDialog(true)
  }

  const handleSaveTask = () => {
    const title = taskTitle.trim()
    if (title) {
      if (dialogType === 'add') {
        const newTask = createTask({ title, column: dialogColumn as any })
        dispatch(kanbanActions.addTask(newTask))
        dispatch(saveKanbanTasksAsync())
        showToast('Task added!')
      } else if (selectedTask) {
        const updatedTask = { ...selectedTask, title }
        dispatch(kanbanActions.updateTask(updatedTask))
        dispatch(saveKanbanTasksAsync())
        showToast('Task updated!')
      }
    }
    setShowDialog(false)
    setTaskTitle('')
    setSelectedTask(null)
  }

  const handleCloseDialog = () => {
    setShowDialog(false)
    setTaskTitle('')
    setSelectedTask(null)
  }

  const tasksByColumn = KANBAN_COLUMNS.reduce((acc, col) => {
    acc[col] = kanbanState.tasks.filter(t => t.column === col)
    return acc
  }, {} as Record<string, Task[]>)

  return (
    <View className='kanban-screen'>
      <View className='kanban-header'>
        <Text className='kanban-title'>Kanban Board</Text>
        <Text className='kanban-subtitle'>{kanbanState.tasks.length} tasks</Text>
      </View>

      {isLoading ? (
        <View className='loading-container'>
          <Text className='loading-text'>Loading...</Text>
        </View>
      ) : (
        <ScrollView scrollX enableFlex className='kanban-board'>
          {KANBAN_COLUMNS.map(column => (
            <KanbanColumn
              key={column}
              title={column}
              tasks={tasksByColumn[column] || []}
              wipLimit={getWipLimit(column)}
              onTaskTap={handleTaskTap}
              onAddTask={handleAddTask}
              onTaskMove={handleTaskMoveRequest}
              onTaskDeleted={handleTaskDeleted}
              onTaskPriorityChanged={handleTaskPriorityChanged}
            />
          ))}
        </ScrollView>
      )}

      {showDialog && (
        <View className='dialog-overlay' onClick={handleCloseDialog}>
          <View className='dialog' onClick={(e) => e.stopPropagation()}>
            <Text className='dialog-title'>
              {dialogType === 'add' ? 'Add Task' : 'Edit Task'}
            </Text>
            <View className='dialog-input-wrapper'>
              <Input
                className='dialog-input-native'
                style='height: 88rpx; min-height: 88rpx; font-size: 28rpx;'
                name='taskTitle'
                type='text'
                value={taskTitle}
                onInput={(e) => setTaskTitle(e.detail.value)}
                placeholder='Task name'
                placeholderClass='dialog-input-placeholder'
              />
            </View>
            <View className='dialog-buttons'>
              <View className='dialog-btn cancel-btn' onClick={handleCloseDialog}>
                <Text className='dialog-btn-text'>Cancel</Text>
              </View>
              <View className='dialog-btn save-btn' onClick={handleSaveTask}>
                <Text className='dialog-btn-text'>Save</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {pendingMoveTask && (
        <View className='dialog-overlay' onClick={() => setPendingMoveTask(null)}>
          <View className='dialog move-dialog' onClick={(e) => e.stopPropagation()}>
            <Text className='dialog-title'>Move Task</Text>
            <Text className='move-task-title'>{pendingMoveTask.title}</Text>
            <View className='move-options'>
              {KANBAN_COLUMNS.filter(column => column !== pendingMoveTask.column).map(column => (
                <View
                  key={column}
                  className='move-option'
                  onClick={() => handleMoveToColumn(column)}
                >
                  <Text className='move-option-text'>Move to {column}</Text>
                </View>
              ))}
            </View>
            <View className='dialog-buttons'>
              <View className='dialog-btn cancel-btn' onClick={() => setPendingMoveTask(null)}>
                <Text className='dialog-btn-text'>Cancel</Text>
              </View>
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

export default KanbanScreen
