// Test file to demonstrate avatar URL cleaning functionality
import { cleanAvatarUrl, generateInitials, generateAvatarColor } from './avatarUtils';

// Test cases for avatar URL cleaning
const testCases = [
  {
    name: 'Malformed URL with duplicate base and /api/api',
    input: 'http://127.0.0.1:8000/api/apihttp://127.0.0.1:8000/storage/avatars/mkHtZFA0BJFYOHtrTfR5bqcIucHDZdaAampY8jhD.jpg',
    expected: 'http://127.0.0.1:8000/storage/avatars/mkHtZFA0BJFYOHtrTfR5bqcIucHDZdaAampY8jhD.jpg'
  },
  {
    name: 'Escaped backslashes',
    input: 'http:\\/\\/127.0.0.1:8000\\/storage\\/avatars\\/test.jpg',
    expected: 'http://127.0.0.1:8000/storage/avatars/test.jpg'
  },
  {
    name: 'Duplicate base URL',
    input: 'http://127.0.0.1:8000http://127.0.0.1:8000/storage/avatars/test.jpg',
    expected: 'http://127.0.0.1:8000/storage/avatars/test.jpg'
  },
  {
    name: 'Valid URL should remain unchanged',
    input: 'http://127.0.0.1:8000/storage/avatars/test.jpg',
    expected: 'http://127.0.0.1:8000/storage/avatars/test.jpg'
  },
  {
    name: 'Relative path should be converted to absolute',
    input: '/storage/avatars/test.jpg',
    expected: 'http://127.0.0.1:8000/storage/avatars/test.jpg'
  }
];

// Test initials generation
const initialsTestCases = [
  { name: 'John Doe', expected: 'JD' },
  { name: 'John', expected: 'JN' },
  { name: 'John Smith Jones', expected: 'JJ' },
  { name: '', expected: '?' },
  { name: 'J', expected: 'J' }
];

// Function to run tests
export const runAvatarTests = () => {
  console.log('🧪 Running Avatar Utils Tests...\n');
  
  // Test URL cleaning
  console.log('📝 Testing URL Cleaning:');
  testCases.forEach((test, index) => {
    const result = cleanAvatarUrl(test.input);
    const passed = result === test.expected;
    console.log(`${index + 1}. ${test.name}`);
    console.log(`   Input: ${test.input}`);
    console.log(`   Expected: ${test.expected}`);
    console.log(`   Result: ${result}`);
    console.log(`   Status: ${passed ? '✅ PASS' : '❌ FAIL'}\n`);
  });
  
  // Test initials generation
  console.log('📝 Testing Initials Generation:');
  initialsTestCases.forEach((test, index) => {
    const result = generateInitials(test.name);
    const passed = result === test.expected;
    console.log(`${index + 1}. Name: "${test.name}"`);
    console.log(`   Expected: ${test.expected}`);
    console.log(`   Result: ${result}`);
    console.log(`   Status: ${passed ? '✅ PASS' : '❌ FAIL'}\n`);
  });
  
  // Test color generation
  console.log('📝 Testing Color Generation:');
  const colorTests = ['John Doe', 'Jane Smith', 'Bob Johnson'];
  colorTests.forEach((name, index) => {
    const color = generateAvatarColor(name);
    const isValidColor = /^#[0-9A-F]{6}$/i.test(color);
    console.log(`${index + 1}. Name: "${name}"`);
    console.log(`   Color: ${color}`);
    console.log(`   Valid: ${isValidColor ? '✅ YES' : '❌ NO'}\n`);
  });
  
  console.log('🎉 Avatar Utils Tests Complete!');
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.runAvatarTests = runAvatarTests;
}