import { useState } from 'react';
import { Heading } from '../../Heading/Heading'
import CustomInput from '../../Utils/CustomInput'
import "./TravelerInfo.scss"
export const TravelerInfo = () => {
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
  return (
    <div className='traveler__container'>
        <Heading title='1. Traveler Info'/>
        <div className="traveler__inputs">
            <div className="input full__name">
                <CustomInput
                    type='text'
                    label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
                <CustomInput
                    type='text'
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
            </div>
            <div className="input phone">
                <CustomInput
                    label="Phone"
                    type='tel'
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
            </div>
            <div className="input email">
                <CustomInput
                    type='email'
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required={true}
                />
            </div>
        </div>
        <div className="disable__button">
            <button>
               <p>Next: Billing Info</p> 
            </button>
        </div>
    </div>
  )
}
