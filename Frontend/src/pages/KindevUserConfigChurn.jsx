import React, { useEffect, useState ,useRef} from 'react';
import { Typography, Tabs, Table, Button, Input, message, DatePicker,Tag, Modal, Select, Checkbox } from 'antd';
import { PlusCircleOutlined, DeleteOutlined, CloseOutlined, SettingOutlined } from '@ant-design/icons';
import CommonButton from '../components/CommonButton';
import ResetButton from '../components/ResetButton';
import DeleteButton from '../components/DeleteButton';
import axios from 'axios';
import dayjs from 'dayjs';

const { Title } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
message.config({
  top: 70,        // position from top
  duration: 3,    // visible for 3 seconds
});

const KindevUserConfigChurn = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const inputStyle = {
  marginBottom: 6,
  borderRadius: '8px',  
  height: '40px',
  width: '100%',
};

const locationOptions = ["Chennai", "Bangalore", "Mumbai"];

const productOptions = [
  "Product 1",
  "Product 2",
  "Product 3",
];

const tradeOptions = [
  "Trade 1",
  "Trade 2",
  "Trade 3",
];

  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
  name: '',
  email: '',
  password: '',
  retype_password: '',
  date_of_birth: '',
  gender: null,

  role: '',

   location: [],
  product: [],
  trade: [],
  profile_image: null,
  imagePreview: null
});


const [modifyForm, setModifyForm] = useState({
  name: '',
  email: '',
  password: '',
  retype_password: '',
  date_of_birth: '',
  gender: null,

  role: '',

  location: [],
  product: [],
  trade: [],
  profile_image: null,
  imagePreview: null,
  hasExistingImage: false,
  existingImageUrl: null,
});
const [deleteModalVisible, setDeleteModalVisible] = useState(false);
const [userToDelete, setUserToDelete] = useState(null);
const [passwordMatch, setPasswordMatch] = useState(true);
const [modifyPasswordMatch, setModifyPasswordMatch] = useState(true);
const [isEditing, setIsEditing] = useState(false);
const [editingUserId, setEditingUserId] = useState(null);
const [activeTab, setActiveTab] = useState("1");



const [validationErrors, setValidationErrors] = useState({});

  
  const createFileInputRef = useRef(null);
  const modifyFileInputRef = useRef(null);
  const [currentUser, setCurrentUser] = useState(null);
  


  const baseURL = "http://127.0.0.1:8000/userconfig";

  

  const BLOCKED = new Set(['retention pathway', 'user control']);  // ⬅️ one source of truth


  const generateCustomFilename = (name, role, dob, originalName) => {
  const ext = originalName.split('.').pop();
  const safeName = name?.replace(/\s+/g, '_') || 'user';
  const safeRole = role?.replace(/\s+/g, '_') || 'role';
  const safeDob = dob || new Date().toISOString().split('T')[0];
  return `${safeName}_${safeRole}_${safeDob}.${ext}`;
};

  useEffect(() => {
    fetchUsers();
  }, []);


  useEffect(() => {
  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("accessToken"); // or sessionStorage
      if (!token) {
        console.warn("No token found, skipping current user fetch");
        return;
      }

      const res = await axios.get(`${baseURL}/users/me/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCurrentUser(res.data);
    } catch (err) {
      console.error("Failed to fetch current user:", err);
    }
  };

  fetchCurrentUser();
}, []);

const clearError = (field) => {
  setValidationErrors(prev => {
    if (!prev[field]) return prev;
    const next = { ...prev };
    delete next[field];
    return next;
  });
};

const showRetypeRequired =
  (modifyForm.password && modifyForm.password.length > 0) &&
  (!modifyForm.retype_password || modifyForm.retype_password.length === 0);

const showRetypeMismatch =
  (modifyForm.retype_password && modifyForm.retype_password.length > 0) &&
  !modifyPasswordMatch;

const showPasswordRequired =
  (modifyForm.retype_password && modifyForm.retype_password.length > 0) &&
  (!modifyForm.password || modifyForm.password.length === 0);

const handleTabChange = (key) => {
  if (isEditing && key !== "4") {
    message.warning("Finish editing or click Cancel/Update to leave edit mode.");
    return; // block switching
  }
  setActiveTab(key);
};


  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${baseURL}/users/`);
      console.log('API Response:', res.data);
      setUsers(res.data);
    } catch (err) {
      message.error('Failed to fetch users');
    }
  };

const handleDeleteUser = async () => {
  console.log('handleDeleteUser called');
  console.log('userToDelete:', userToDelete);
  
  if (!userToDelete) {
    console.log('No userToDelete found, returning early');
    return;
  }

  try {
    console.log('About to call API delete for user ID:', userToDelete.id);
    
    // Step 1: Show loading message immediately
    const loadingMessage = messageApi.loading('Deleting user...', 0);
    
    // Step 2: Close modal and clear user state
    setDeleteModalVisible(false);
    const currentUser = userToDelete;
    setUserToDelete(null);

    // Step 3: Perform deletion
    const response = await axios.delete(`${baseURL}/users/delete/${currentUser.id}/`);
    console.log('API Response:', response);

    // Step 4: Close loading message and show success
    loadingMessage();
    messageApi.success('User deleted successfully!', 2);

    // Step 5: Refresh users list
    setUsers(prev => prev.filter(u => u.id !== currentUser.id));
    
  } catch (err) {
    console.error('Delete error:', err);
    messageApi.error('Failed to delete user');
  }
};

const handleCreateUser = async () => {
  const errors = {};

  if (!form.name) errors.name = "Name is required";
  if (!form.email) errors.email = "Email is required";
  if (!form.password) errors.password = "Password is required";
  if (!form.role) errors.role = "Role is required";
  if (form.password !== form.retype_password) errors.retype_password = "Passwords do not match";
  if (!form.retype_password) {
    errors.retype_password = "Retype Password is required";
  } else if (form.password !== form.retype_password) {
    errors.retype_password = "Passwords do not match";
  }

  setValidationErrors(errors);

  if (Object.keys(errors).length > 0) {
    message.error("Please fill all required fields correctly.");
    return;
  }

  const formData = new FormData();
  formData.append("username", form.name);
  formData.append("email", form.email);
  formData.append("password", form.password);
  if (form.date_of_birth) formData.append("date_of_birth", form.date_of_birth);
  if (form.gender) formData.append("gender", form.gender);
  if (form.role) formData.append("role", form.role);
  if (form.profile_image) formData.append("profile_image", form.profile_image);

  try {
    const response = await axios.post(`${baseURL}/users/create/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const createdUser = response.data;
    await messageApi.open({
  type: 'loading',
  content: 'Creating user...',
  duration: 1.5,
});

await messageApi.success({
  content: 'User created successfully!',
  duration: 2,
});

 // Get created user object with ID

    // ⛳ Automatically assign "Retention pathway" access
  

    setForm({
      name: '', email: '', date_of_birth: '', gender: '', password: '', retype_password: '',
       role: '', profile_image: null, imagePreview: null
    });
    setValidationErrors({});
    fetchUsers();
  } catch (err) {
    console.error("Create user error:", err.response?.data);
    message.error("User creation failed");
  }
};

const handleResetCreateForm = () => {
  setForm({
    name: '',
    email: '',
    password: '',
    retype_password: '',
    date_of_birth: '',
    gender: null,
    role: '',
    profile_image: null,
    imagePreview: null,
  });
  setValidationErrors({});
  setPasswordMatch(true);
};


const handleUpdateUser = async () => {
  try {
    await messageApi.open({
      type: 'loading',
      content: 'Updating user...',
      duration: 1.2,
    });

    const formData = new FormData();
    formData.append("username", modifyForm.name);
    formData.append("email", modifyForm.email);
    if (modifyForm.password) formData.append("password", modifyForm.password);
    if (modifyForm.date_of_birth) formData.append("date_of_birth", modifyForm.date_of_birth);
    if (modifyForm.gender) formData.append("gender", modifyForm.gender);

    if (modifyForm.role) formData.append("role", modifyForm.role);
    
    // Handle profile image
    if (modifyForm.profile_image) {
      // New image uploaded
      formData.append("profile_image", modifyForm.profile_image);
    } else if (!modifyForm.hasExistingImage && !modifyForm.imagePreview) {
      // Image was deleted (send empty string or null to backend)
      formData.append("profile_image", "");
    }

    await axios.put(`${baseURL}/users/update/${editingUserId}/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    await messageApi.success({
      content: 'User updated successfully!',
      duration: 2,
    });

    // Reset states
    setModifyForm({
      name: '', email: '', password: '', retype_password: '',
      date_of_birth: '', gender: '', 
      role: '', profile_image: null, imagePreview: null,
      hasExistingImage: false, existingImageUrl: null,
    });
    setIsEditing(false);
    setEditingUserId(null);
    setModifyPasswordMatch(true);

    // Refresh user list
    fetchUsers();
  } catch (err) {
    messageApi.error('Update failed');
  }
};

   const handleModifyClick = (user) => {

    console.log('Full user object:', user);
  console.log('User profile_image field:', user.profile_image);
    let imageUrl = null;
  if (user.profile_image) {
    // Remove any duplicate slashes and ensure proper URL formation
    const cleanImagePath = user.profile_image.replace(/^\/+/, '');
    imageUrl = `https://dev.churn.prowesstics.co.in/media/${user.profile_image}`;
  }
    setModifyForm({
      name: user.username,
      email: user.email,
      password: '',
      retype_password: '',
      date_of_birth: user.date_of_birth,
      gender: user.gender,
      
      role: user.role,
      profile_image: null,
      
      imagePreview: user.profile_image ,
      hasExistingImage: !!user.profile_image,
      existingImageUrl: user.profile_image,
  });
  console.log('User profile image path:', user.profile_image);
  console.log('Constructed image URL:', user.profile_image);
    setIsEditing(true);
    setEditingUserId(user.id);
    setModifyPasswordMatch(true);
  };

  // Function to cancel editing
  const handleCancelEdit = () => {
    setModifyForm({
      name: '', email: '', password: '', retype_password: '',
      date_of_birth: '', gender: '', 
      role: '', profile_image: null, imagePreview: null,
      hasExistingImage: false, existingImageUrl: null,
    });
    setIsEditing(false);
    setEditingUserId(null);
    setModifyPasswordMatch(true);
  };

  const handleDeleteImage = async (userId) => {
  console.log('handleDeleteImage called with userId:', userId); // Debug log
  
  if (!userId) {
    console.error('No userId provided to handleDeleteImage');
    messageApi.error('Error: No user ID found');
    return;
  }

  try {
    // Show loading message
    const loadingMessage = messageApi.loading('Deleting image...', 0);

    // Call the API to remove the image
    const response = await axios.delete(`${baseURL}/users/remove_image/${userId}/`);
    console.log('Delete API response:', response); // Debug log

    // Close loading message
    loadingMessage();

    // Show success message
    messageApi.success('Image deleted successfully!', 2);

    // Clear the form state
    setModifyForm(prev => ({ 
      ...prev, 
      profile_image: null, 
      imagePreview: null,
      hasExistingImage: false,
      existingImageUrl: null, 
    }));

    // Refresh the users list to reflect the change
    await fetchUsers();
    
  } catch (error) {
    console.error('Error deleting image:', error.response?.data || error.message);
    messageApi.error(`Failed to delete image: ${error.response?.data?.message || error.message}`);
  }
};

const customTagRender = (props) => {
  const { label, closable, onClose } = props;

  return (
    <Tag
      closable={closable}
      onClose={onClose}
      closeIcon={<CloseOutlined />}
      style={{
        marginRight: 6,
        padding: '4px 10px',
        borderRadius: '20px',
        background: '#e6f4ff',
        border: '1px solid #91caff',
        color: '#0958d9',
        fontWeight: 500,
      }}
    >
      {label}
    </Tag>
  );
};

 return (
    <div
      style={{
        // padding: '10px',
        marginTop : '-12px',
        background: '#f0f2f5',
        minHeight: '100vh',
        // marginLeft: '24px',
        maxWidth: 'calc(100vw - 170px)',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ maxWidth: '100%', margin: '0 auto' }}>
        {/* <Title level={3} style={{ textAlign: 'center', marginBottom: '24px' }}>
          User Control Panel
        </Title> */}
{contextHolder}
        <Tabs activeKey={activeTab} onChange={handleTabChange}>

          <TabPane tab="Create User" key="1" disabled={isEditing}>
  <div style={{ display: 'flex', justifyContent: 'center', minHeight: '70vh', alignItems: 'flex-start' }}>
    <div
      style={{
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        padding: '32px',
        display: 'flex',
        gap: '32px',
        
        // maxWidth: '1090px',
        width: '100%',
      }}
    >
      {/* LEFT SIDE FORM */}
      <div style={{ flex: 1 }}>
        {/* <Title level={4} style={{ marginBottom: '20px' }}>Create New User</Title> */}

        <div style={{ marginBottom: 8 }}>
          {validationErrors.name && (
    <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' ,marginLeft:'18px'}}>{validationErrors.name}</div>
  )}
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <span style={{ color: 'red', fontSize: '20px', marginRight: 6 }}>*</span>
    <Input
  placeholder="Name"
  value={form.name}
  onChange={e => {
    const v = e.target.value;
    setForm(prev => ({ ...prev, name: v }));
    if (v) clearError('name');
  }}
  style={inputStyle}
/>
  </div>
  
</div>

        <div style={{ marginBottom: 8 }}>
          {validationErrors.email && (
    <div style={{ color: 'red', fontSize: '12px', marginTop: '4px',marginLeft:'18px' }}>{validationErrors.email}</div>
  )}
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <span style={{ color: 'red', fontSize: '20px', marginRight: 6 }}>*</span>
    <Input
      placeholder="Email"
      value={form.email}
      onChange={e => {
    const v = e.target.value;
    setForm(prev => ({ ...prev, email: v }));
    if (v) clearError('email');
  }}
      style={inputStyle}
    />
  </div>
  
</div>

        <div style={{ marginBottom: 8 }}>
          {validationErrors?.password && (
    <div style={{ color: 'red', fontSize: '12px', marginTop: '4px',marginLeft:'18px' }}>{validationErrors.password}</div>
  )}
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <span style={{ color: 'red', fontSize: '20px', marginRight: 6 }}>*</span>
    <Input
      placeholder="Password"
      type="password"
      value={form.password}
      onChange={e => {
    const newPassword = e.target.value;
    setForm(prev => {
      const updated = { ...prev, password: newPassword };
      setPasswordMatch(updated.retype_password === newPassword);
      return updated;
    });
    if (newPassword) clearError('password');
    // if passwords now match, clear mismatch error too
    if (newPassword === form.retype_password) clearError('retype_password');
  }}
      style={inputStyle}
      autoComplete="new-password"
    />
  </div>
  
</div>

<div style={{ marginBottom: 8 }}>
  {validationErrors?.retype_password && (
    <div style={{ color: 'red', fontSize: '12px', marginTop: '4px', marginLeft:'18px' }}>{validationErrors.retype_password}</div>
  )}
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <span style={{ color: 'red', fontSize: '20px', marginRight: 6 }}>*</span>
    <Input
      placeholder="Retype Password"
      type="password"
      value={form.retype_password}
      onChange={e => {
        const newRetype = e.target.value;
        setForm(prev => {
          const updatedForm = { ...prev, retype_password: newRetype };
          setPasswordMatch(updatedForm.password === newRetype);
          return updatedForm;
        });
        if (newRetype) clearError('retype_password');           // clear its own required error
        if (newRetype === form.retype_password) {        // if now matches, clear mismatch error
        clearError('retype_password');
      }}}
      style={{
        ...inputStyle,
        borderColor: form.retype_password.length > 0
          ? passwordMatch ? 'green' : 'red'
          : (validationErrors.retype_password ? 'red' : undefined),
        boxShadow: form.retype_password.length > 0
          ? `0 0 0 1px ${passwordMatch ? 'green' : 'red'}`
          : (validationErrors.retype_password ? '0 0 0 0.1px red' : undefined),
      }}
      autoComplete="new-password"
    />
  </div>
    
  {form.retype_password && passwordMatch && !validationErrors.retype_password && (
    <div style={{ color: 'green', fontSize: '13px', marginTop: '-10px', marginLeft:'18px' }}>
      Password matched
    </div>
  )}
</div>

<div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
  <span style={{  color: 'transparent', fontSize: '20px', marginRight: 6 }}>*</span>
        <DatePicker
  style={inputStyle}
  placeholder="Select Date of Birth"
  value={form.date_of_birth ? dayjs(form.date_of_birth) : null}
  onChange={(date, dateString) => setForm({ ...form, date_of_birth: dateString })}
/></div>
<div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
  <span style={{  color: 'transparent', fontSize: '20px', marginRight: 6 }}>*</span>
        <Select
  placeholder="Select Gender"
  value={form.gender}
  onChange={value => setForm({ ...form, gender: value })}
  style={inputStyle}
  allowClear
>
  <Option value="Male">Male</Option>
  <Option value="Female">Female</Option>
</Select></div>
<div style={{ display: 'flex', alignItems: 'center'}}>
  
  <span style={{  color: 'transparent', fontSize: '20px', marginRight: 6 }}>*</span>
        <Input placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} style={inputStyle} />
       
      </div> {/* <Input placeholder="Sector" value={form.sector} onChange={e => setForm({ ...form, sector: e.target.value })} style={inputStyle} /> */}
        <div style={{ marginBottom: 8 }}>
          {validationErrors.role && (
    <div style={{ color: 'red', fontSize: '12px', marginTop: '4px', marginLeft:'18px' }}>{validationErrors.role}</div>
  )}
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <span style={{ color: 'red', fontSize: '20px', marginRight: 6 }}>*</span>
    <Input
      placeholder="Role"
      value={form.role}
      onChange={e => {
    const v = e.target.value;
    setForm(prev => ({ ...prev, role: v }));
    if (v) clearError('role');
  }}
      style={inputStyle}
    />
  </div>

  <div style={{ marginTop: '24px', marginBottom: '20px' }}>
  <div
    style={{
      fontSize: '13px',
      fontWeight: '700',
      color: '#1d4ed8',
      letterSpacing: '1px',
      marginBottom: '18px'
    }}
  >
    DATA ACCESS
  </div>

  {/* Location */}
  <div style={{ marginBottom: 6 }}>
    <div style={{ marginBottom: 6, fontWeight: 400 }}>Location</div>
    <Select
      mode="multiple"
      placeholder="Select Location"
      value={form.location}
      onChange={(value) => setForm({ ...form, location: value })}
      style={inputStyle}
      tagRender={customTagRender}
      options={locationOptions.map(item => ({
        label: item,
        value: item
      }))}
    />
  </div>

  {/* Product */}
  <div style={{ marginBottom: 6 }}>
    <div style={{ marginBottom: 6, fontWeight: 400 }}>Product</div>
    <Select
      mode="multiple"
      placeholder="Select Product"
      value={form.product}
      onChange={(value) => setForm({ ...form, product: value })}
      style={inputStyle}
      tagRender={customTagRender}
      options={productOptions.map(item => ({
        label: item,
        value: item
      }))}
    />
  </div>

  {/* Trade */}
  <div style={{ marginBottom: 6 }}>
    <div style={{ marginBottom: 6, fontWeight: 400 }}>Trade</div>
    <Select
      mode="multiple"
      placeholder="Select Trade"
      value={form.trade}
      onChange={(value) => setForm({ ...form, trade: value })}
      style={inputStyle}
      tagRender={customTagRender}
      options={tradeOptions.map(item => ({
        label: item,
        value: item
      }))}
    />
  </div>
</div>
  
</div>

        {/* <Input placeholder="Designation" value={form.designation} onChange={e => setForm({ ...form, designation: e.target.value })} style={inputStyle} /> */}
<div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 16 }}>
  <span style={{  color: 'transparent', fontSize: '20px', marginRight: 6 }}>*</span>
  <div style={{ display: 'flex', gap: 12, width: '100%' }}>
        <CommonButton
          type="primary"
          block
          onClick={handleCreateUser}
          style={{ height: '45px', fontWeight: '500', fontSize: '16px', marginTop: '12px' }}
        >
          Create User
        </CommonButton>
        <ResetButton
      block
      onClick={handleResetCreateForm}
      style={{ height: '45px', fontWeight: '500', fontSize: '16px', marginTop: '12px' }}
    >
      Reset
    </ResetButton></div>
      </div></div>

      {/* RIGHT SIDE IMAGE UPLOAD */}
      <div style={{ width: '260px', textAlign: 'center' }}>
        <Title level={5}>Profile Picture</Title>
        <label htmlFor="upload-image" style={{ display: 'block', cursor: 'pointer' }}>
          <div style={{
            border: '2px dashed #aaa',
            borderRadius: '8px',
            padding: '16px',
            height: '200px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#f9f9f9'
          }}>
            {form.imagePreview ? (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <img src={form.imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '160px' }} />
    
  </div>
) : (
  <div>Click here to upload</div>
)}


          </div>
        </label>
<input
  id="upload-image"
  ref={createFileInputRef}
  type="file"
  accept="image/*"
  onClick={(e) => {
    // Important: reset the value so picking the same file triggers onChange
    e.currentTarget.value = '';
  }}
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const customFilename = generateCustomFilename(
      form.name, form.role, form.date_of_birth, file.name
    );
    const renamedFile = new File([file], customFilename, { type: file.type });

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(prev => ({ ...prev, profile_image: renamedFile, imagePreview: reader.result }));
    };
    reader.readAsDataURL(file);
  }}
  style={{ display: 'none' }}
/>

{form.imagePreview && (
  <Button
    danger
    size="small"
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      setForm(prev => ({ ...prev, profile_image: null, imagePreview: null }));
      if (createFileInputRef.current) {
        createFileInputRef.current.value = '';
      }
    }}
    style={{ marginTop: '8px' }}
  >
    Remove Image
  </Button>
)}

 </div>
    </div>
  </div>
</TabPane>

<TabPane tab="Modify User" key="4">
  <div style={{ background: '#fff', borderRadius: '8px', padding: '24px' }}>
    {!isEditing ? (
      <>
        <Input.Search
          placeholder="Search users..."
          onChange={(e) => {
            const query = e.target.value.toLowerCase();
            setUsers(prev => prev.map(user => ({
              ...user,
              visible: user.username.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)
            })));
          }}
          style={{ width: '300px', marginBottom: '16px' }}
        />
        <div>
          {[...users]
  .filter(user => user.visible !== false)
  .sort((a, b) => (a.username === 'admin' ? -1 : b.username === 'admin' ? 1 : 0))
  .map(user => (
            <div key={user.id} style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '12px' }}>
              <Input value={user.username} disabled style={{ width: 200 }} />
              <Input value={user.email} disabled style={{ width: 260 }} />
              <Input value={user.role} disabled style={{ width: 160 }} />
              
              <CommonButton
  onClick={() => handleModifyClick(user)}
  style={{
    width: "120px",
    height: "36px",
    fontSize: "14px",
    padding: "6px 12px"
  }}
>
  Modify
</CommonButton>
            </div>
          ))}
        </div>
      </>
    ) : (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
        <div
          style={{
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            padding: '32px',
            display: 'flex',
            gap: '32px',
            maxWidth: '1090px',
            width: '100%',
          }}
        >
          {/* LEFT SIDE FORM */}
          <div style={{ flex: 1 }}>
            <Title level={4} style={{ marginBottom: '20px' }}>Edit User Details</Title>

            <div style={{ marginBottom: 16 }}>
              <Input
                placeholder="Name"
                value={modifyForm.name}
                onChange={e => setModifyForm({ ...modifyForm, name: e.target.value })}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <Input
                placeholder="Email"
                value={modifyForm.email}
                onChange={e => setModifyForm({ ...modifyForm, email: e.target.value })}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              {showPasswordRequired && (
    <div style={{ color: 'red', fontSize: '12px', marginBottom: 4 }}>
      New Password is required
    </div>
  )}
              <Input
                placeholder="New Password (leave blank to keep current)"
                type="password"
                value={modifyForm.password}
                onChange={e => {
                  const newPassword = e.target.value;
                  setModifyForm(prev => {
                    const updatedForm = { ...prev, password: newPassword };
                    setModifyPasswordMatch(updatedForm.retype_password === newPassword || updatedForm.retype_password === '');
                    return updatedForm;
                  });
                }}
                style={inputStyle}
                autoComplete="new-password"
              />
            </div>


            <div style={{ marginBottom: 16 }}>
              {showRetypeRequired && (
    <div style={{ color: 'red', fontSize: '12px', marginBottom: 4 }}>
      Retype Password is required
    </div>
  )}
              
              <Input
                placeholder="Retype New Password"
                type="password"
                value={modifyForm.retype_password}
                onChange={e => {
                  const newRetype = e.target.value;
                  setModifyForm(prev => {
                    const updatedForm = { ...prev, retype_password: newRetype };
                    setModifyPasswordMatch(updatedForm.password === newRetype || newRetype === '');
                    return updatedForm;
                  });
                }}
                style={{
      ...inputStyle,
      borderColor: showRetypeRequired
        ? 'red'
        : (modifyForm.retype_password.length > 0
            ? (modifyPasswordMatch ? 'green' : 'red')
            : undefined),
      boxShadow: showRetypeRequired
        ? '0 0 0 1px red'
        : (modifyForm.retype_password.length > 0
            ? `0 0 0 1px ${modifyPasswordMatch ? 'green' : 'red'}`
            : undefined),
    }}
                autoComplete="new-password"
              />
              {modifyForm.retype_password && modifyPasswordMatch && !showRetypeRequired &&(
                <div style={{ color: 'green', fontSize: '13px', marginTop: '4px', }}>
                  Passwords match
                </div>
              )}
              {modifyForm.retype_password && showRetypeMismatch && (
                <div style={{ color: 'red', fontSize: '13px', marginTop: '4px' }}>
                  Passwords do not match
                </div>
              )}
            </div>

            <div style={{ marginBottom: 16 }}>
              <DatePicker
                style={inputStyle}
                placeholder="Select Date of Birth"
                value={modifyForm.date_of_birth ? dayjs(modifyForm.date_of_birth) : null}
                onChange={(date, dateString) => setModifyForm({ ...modifyForm, date_of_birth: dateString })}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <Select
                placeholder="Select Gender"
                value={modifyForm.gender}
                onChange={value => setModifyForm({ ...modifyForm, gender: value })}
                style={inputStyle}
                allowClear
              >
                <Option value="Male">Male</Option>
                <Option value="Female">Female</Option>
              </Select>
            </div>

            

            <div style={{ marginBottom: 16 }}>
              <Input
                placeholder="Role"
                value={modifyForm.role}
                onChange={e => setModifyForm({ ...modifyForm, role: e.target.value })}
                style={inputStyle}
              />
            </div>

            <div style={{ marginTop: '24px', marginBottom: '20px' }}>
  <div
    style={{
      fontSize: '13px',
      fontWeight: '700',
      color: '#1d4ed8',
      letterSpacing: '1px',
      marginBottom: '18px'
    }}
  >
    DATA ACCESS
  </div>

  {/* Location */}
  <div style={{ marginBottom: 16 }}>
    <div style={{ marginBottom: 6, fontWeight: 500 }}>Location</div>
    <Select
      mode="multiple"
      placeholder="Select Location"
      value={form.location}
      onChange={(value) => setForm({ ...form, location: value })}
      style={inputStyle}
      tagRender={customTagRender}
      options={locationOptions.map(item => ({
        label: item,
        value: item
      }))}
    />
  </div>

  {/* Product */}
  <div style={{ marginBottom: 16 }}>
    <div style={{ marginBottom: 6, fontWeight: 500 }}>Product</div>
    <Select
      mode="multiple"
      placeholder="Select Product"
      value={form.product}
      onChange={(value) => setForm({ ...form, product: value })}
      style={inputStyle}
      tagRender={customTagRender}
      options={productOptions.map(item => ({
        label: item,
        value: item
      }))}
    />
  </div>

  {/* Trade */}
  <div style={{ marginBottom: 16 }}>
    <div style={{ marginBottom: 6, fontWeight: 500 }}>Trade</div>
    <Select
      mode="multiple"
      placeholder="Select Trade"
      value={form.trade}
      onChange={(value) => setForm({ ...form, trade: value })}
      style={inputStyle}
      tagRender={customTagRender}
      options={tradeOptions.map(item => ({
        label: item,
        value: item
      }))}
    />
  </div>
</div>

             <div style={{ display: 'flex', gap: '12px' }}>
              <CommonButton
                type="primary"
                onClick={handleUpdateUser}
                disabled={!modifyPasswordMatch || showRetypeRequired || showPasswordRequired}
                style={{
    width: "120px",
    height: "36px",
    fontSize: "14px",
    padding: "6px 12px"
  }}
              >
                Update User
              </CommonButton>
              <ResetButton
                onClick={handleCancelEdit}
                style={{
    width: "120px",
    height: "36px",
    fontSize: "14px",
    padding: "6px 12px"
  }}
              >
                Cancel
              </ResetButton>
            </div>
          </div>

          {/* RIGHT SIDE IMAGE UPLOAD */}
          <div style={{ width: '260px', textAlign: 'center' }}>
            <Title level={5}>Profile Picture</Title>
            <label htmlFor="modify-upload-image" style={{ display: 'block', cursor: 'pointer' }}>
              <div style={{
                border: '2px dashed #aaa',
                borderRadius: '8px',
                padding: '16px',
                height: '200px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#f9f9f9'
              }}>
                {modifyForm.imagePreview ? (
                  <div style={{ 
                    width: '100%', 
                    height: '100%',
                    border: '2px dashed #aaa',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: '#f9f9f9'
                  }}>
                    <img
                      src={modifyForm.imagePreview}
  alt="Preview"
  style={{
    width: "100%",
    height: "100%",
    objectFit: "contain",   // ✅ show whole image
    borderRadius: "4px",
    background: "#fff"      // optional: keep a clean background
  }}
                      onError={(e) => {
                        console.error('Image failed to load:', modifyForm.imagePreview);
                        // Fallback: clear the preview if image fails to load
                        setModifyForm(prev => ({ ...prev, imagePreview: null, hasExistingImage: false }));
                      }}
                    />
                  </div>
                ) : (
                  <div>Click here to upload</div>
                )}
              </div>
            </label>
            
            {modifyForm.imagePreview && (
  <Button
    danger
    size="small"
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();

      if (modifyForm.profile_image) {
        // A new local (unsaved) image is being previewed -> just discard it
        setModifyForm(prev => ({
          ...prev,
          profile_image: null,
          imagePreview: prev.hasExistingImage ? prev.existingImageUrl : null,
          // hasExistingImage and existingImageUrl remain unchanged
        }));
        if (modifyFileInputRef.current) modifyFileInputRef.current.value = '';
        return;
      }
      if (modifyForm.hasExistingImage) {
      
      Modal.confirm({
        title: 'Delete Profile Picture',
        content: 'Are you sure you want to delete this profile picture?',
        okText: 'Yes, Delete',
        cancelText: 'Cancel',
        onOk: () => 
          // Call handleDeleteImage with the current editing user ID
          handleDeleteImage(editingUserId),
          
        });
      }else {
        // Nothing to delete; just ensure fields are cleared
        setModifyForm(prev => ({
          ...prev,
          profile_image: null,
          imagePreview: null,
        }));
      }
    }}
    style={{
      marginTop: '8px',
      width: '100%',
    }}
  >
    Remove Image
  </Button>
)}
            
            <input
              id="modify-upload-image"
              ref={modifyFileInputRef}
              type="file"
              accept="image/*"
              onClick={(e) => {
                      e.currentTarget.value = '';
                   }}
              onChange={(e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const customFilename = generateCustomFilename(
      modifyForm.name, modifyForm.role, modifyForm.date_of_birth, file.name
    );
    const renamedFile = new File([file], customFilename, { type: file.type });

    const reader = new FileReader();
    reader.onloadend = () => {
      setModifyForm(prev => ({
        ...prev,
        profile_image: renamedFile,
        imagePreview: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  }}
  style={{ display: 'none' }}
/>
          </div>
        </div>
      </div>
    )}
  </div>
</TabPane>

<TabPane tab="Delete User" key="5" disabled={isEditing}>
  <div style={{ background: '#fff', borderRadius: '8px', padding: '24px' }}>
    {/* <Title level={4}>Disable User</Title> */}
    <div style={{ marginBottom: '16px' }}>
      <Input.Search
        placeholder="Search users..."
        style={{ width: 300 }}
        onChange={(e) => {
          const search = e.target.value.toLowerCase();
          setUsers(prev => prev.map(u => ({
            ...u,
            visible: u.username.toLowerCase().includes(search) || u.email.toLowerCase().includes(search)
          })));
        }}
      />
    </div>

    {[...users]
  .filter(user => user.visible !== false)
  .sort((a, b) => (a.username === 'admin' ? -1 : b.username === 'admin' ? 1 : 0))
  .map(user => (

      <div key={user.id} style={{ display: 'flex', gap: '16px', marginBottom: '12px', alignItems: 'center' }}>
        <Input value={user.username} disabled style={{ width: 200 }} />
        <Input value={user.email} disabled style={{ width: 260 }} />
        <Input value={user.role} disabled style={{ width: 160 }} /> 
        <DeleteButton

  disabled={
    user.username === "admin" ||
    (currentUser && user.id === currentUser.id)
  }
  onClick={() => {
    setUserToDelete(user);
    setDeleteModalVisible(true);
  }}
  style={{
    width: "120px",
    height: "36px",
    fontSize: "14px",
    padding: "6px 12px"
  }}
>
  Disable
</DeleteButton>
      </div>
    ))}
  </div>
</TabPane>

          
        </Tabs>
          <div style={{ height: '100px', backgroundColor: '#F0F2F5' }} />
        
      </div>

      {/* Delete Confirmation Modal */}
<Modal
  open={deleteModalVisible}
  onOk={handleDeleteUser}
  onCancel={() => {
    setDeleteModalVisible(false);
    setUserToDelete(null);
  }}
  okText="Yes, Delete"
  cancelText="Cancel"
  title="Confirm Deletion"
>
  <p>
    Are you sure you want to delete <strong>{userToDelete?.username || 'this user'}</strong>? <br />
    This action is <b>irreversible</b>.
  </p>
</Modal>
</div>
    
  );

};

export default KindevUserConfigChurn;
