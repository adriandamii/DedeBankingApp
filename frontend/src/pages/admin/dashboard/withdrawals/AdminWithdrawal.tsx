import { Button } from '@mui/material'
import GoBackRoute from '../../../../components/utils/GoBackRoute'
import { useNavigate, useParams } from 'react-router-dom'

const AdminWithdrawal = () => {
   const { uniqueAccountNumber } = useParams();

   const navigate = useNavigate()
   const handleRouteWithdrawalAction = () => {
      navigate(`/admin/account/${uniqueAccountNumber}/withdrawal/action`);
  };
  if (uniqueAccountNumber) {
     console.log(uniqueAccountNumber)
  } else {
   console.log("nu este unique account number")
  }
   return (
    <div>
      <GoBackRoute/>
      <h1>Admin Withdrawal page</h1>
      <h1>Sunt aici</h1>
      <h2>You are on uniqueAccountNumber {uniqueAccountNumber}</h2>
      <Button onClick={handleRouteWithdrawalAction}>Make a withdrawal</Button>
    </div>
  )
}

export default AdminWithdrawal
