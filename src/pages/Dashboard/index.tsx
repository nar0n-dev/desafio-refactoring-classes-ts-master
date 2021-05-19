import { useState, useEffect } from 'react';
import { Header } from '../../components/Header';
import { api } from '../../services/api';
import { Food } from '../../components/Food';
import { ModalAddFood } from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface FoodProps {
  id: number;
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string;
}

export const Dashboard = () => {
  const [foods, setFoods] = useState<FoodProps[]>([]); 
  const [editingFood, setEditingFood] = useState<FoodProps>({} as FoodProps); 
  const [modalOpen, setModalOpen] = useState(false); 
  const [editModalOpen, setEditModalOpen] = useState(false); 

  useEffect(() => {
    async function loadFood() {
      await api.get('/foods').then(response => setFoods(response.data))
    }
    loadFood()
  }, [])

  const handleAddFood = async (food: Omit <FoodProps, 'id' | 'available'>) => {
    try {
      const id = Math.random()
      const newFood = {id, ...food, available: true}
      const response = await api.post('/foods', newFood)
      setFoods([...foods, response.data])
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpdateFood = async (food: Omit <FoodProps, 'id' | 'available'>) => {
    try {
      const { id,  } = editingFood;

      const updatedFood =  {id, ...food, available: true}

      const response = await api.put(`/foods/${editingFood.id}`, updatedFood)

      const UpdatedFoods = foods.filter(obj => obj.id !== id)

      setFoods([...UpdatedFoods, response.data])
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteFood = async (id: number) => {
    await api.delete(`/foods/${id}`)
    const foodFilter = foods.filter(food => food.id !== id)
    setFoods(foodFilter);
  }

  const toggleModal = () => {
    setModalOpen(!modalOpen)
  }

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen)
  }

  const handleEditFood = (food: FoodProps) => {
    setEditingFood(food)
    setEditModalOpen(true)
  }


  return (
    <>
      <Header openModal={toggleModal} />

      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />

      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}