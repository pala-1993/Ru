#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for Roulette System
Tests all API endpoints and verifies MongoDB operations
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, List, Any

# Backend URL from environment
BACKEND_URL = "https://fcdc2b63-a030-45d9-b52e-a38c1502d101.preview.emergentagent.com"

class RouletteAPITester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })
        self.test_results = []
        
    def log_test(self, test_name: str, success: bool, details: str = "", response_data: Any = None):
        """Log test results"""
        result = {
            'test': test_name,
            'success': success,
            'details': details,
            'timestamp': datetime.now().isoformat(),
            'response_data': response_data
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {details}")
        if response_data and not success:
            print(f"   Response: {response_data}")
    
    def test_health_check(self):
        """Test 1: Health check endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/api/")
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy":
                    self.log_test("Health Check", True, f"API is healthy: {data.get('message')}", data)
                    return True
                else:
                    self.log_test("Health Check", False, f"Unexpected response format", data)
                    return False
            else:
                self.log_test("Health Check", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Health Check", False, f"Exception: {str(e)}")
            return False
    
    def test_get_current_game(self):
        """Test 2: Get current game state"""
        try:
            response = self.session.get(f"{self.base_url}/api/roulette/game")
            if response.status_code == 200:
                data = response.json()
                required_fields = ['id', 'participants', 'winners', 'created_at', 'updated_at', 'is_active']
                if all(field in data for field in required_fields):
                    participants_count = len(data.get('participants', []))
                    self.log_test("Get Current Game", True, 
                                f"Game retrieved with {participants_count} participants", data)
                    return data
                else:
                    missing = [f for f in required_fields if f not in data]
                    self.log_test("Get Current Game", False, f"Missing fields: {missing}", data)
                    return None
            else:
                self.log_test("Get Current Game", False, f"HTTP {response.status_code}", response.text)
                return None
        except Exception as e:
            self.log_test("Get Current Game", False, f"Exception: {str(e)}")
            return None
    
    def test_create_new_game(self):
        """Test 3: Create new game"""
        try:
            test_participants = [
                "Alice Johnson",
                "Bob Smith", 
                "Charlie Brown",
                "Diana Prince",
                "Edward Norton",
                "Fiona Green"
            ]
            
            payload = {"participants": test_participants}
            response = self.session.post(f"{self.base_url}/api/roulette/game", 
                                       json=payload)
            
            if response.status_code == 200:
                data = response.json()
                if (data.get('participants') == test_participants and 
                    data.get('is_active') == True and
                    len(data.get('winners', [])) == 0):
                    self.log_test("Create New Game", True, 
                                f"Game created with {len(test_participants)} participants", data)
                    return data
                else:
                    self.log_test("Create New Game", False, "Game data doesn't match expected", data)
                    return None
            else:
                self.log_test("Create New Game", False, f"HTTP {response.status_code}", response.text)
                return None
        except Exception as e:
            self.log_test("Create New Game", False, f"Exception: {str(e)}")
            return None
    
    def test_update_participants(self):
        """Test 4: Update participants"""
        try:
            updated_participants = [
                "Ana García",
                "Carlos Rodríguez", 
                "María López",
                "José Martínez",
                "Laura González",
                "Pablo Sánchez"
            ]
            
            payload = {"participants": updated_participants}
            response = self.session.put(f"{self.base_url}/api/roulette/game/participants", 
                                      json=payload)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('participants') == updated_participants:
                    self.log_test("Update Participants", True, 
                                f"Participants updated to {len(updated_participants)} members", data)
                    return data
                else:
                    self.log_test("Update Participants", False, "Participants not updated correctly", data)
                    return None
            else:
                self.log_test("Update Participants", False, f"HTTP {response.status_code}", response.text)
                return None
        except Exception as e:
            self.log_test("Update Participants", False, f"Exception: {str(e)}")
            return None
    
    def test_get_participants(self):
        """Test 5: Get current participants"""
        try:
            response = self.session.get(f"{self.base_url}/api/roulette/participants")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("Get Participants", True, 
                                f"Retrieved {len(data)} participants", data)
                    return data
                else:
                    self.log_test("Get Participants", False, "Response is not a list", data)
                    return None
            else:
                self.log_test("Get Participants", False, f"HTTP {response.status_code}", response.text)
                return None
        except Exception as e:
            self.log_test("Get Participants", False, f"Exception: {str(e)}")
            return None
    
    def test_spin_roulette(self):
        """Test 6: Spin roulette and get winner"""
        try:
            response = self.session.post(f"{self.base_url}/api/roulette/spin")
            if response.status_code == 200:
                data = response.json()
                required_fields = ['winner', 'remaining_participants', 'total_winners']
                if all(field in data for field in required_fields):
                    winner = data['winner']
                    if all(field in winner for field in ['name', 'position', 'timestamp', 'total_participants']):
                        self.log_test("Spin Roulette", True, 
                                    f"Winner: {winner['name']}, Position: {winner['position']}", data)
                        return data
                    else:
                        self.log_test("Spin Roulette", False, "Winner object missing required fields", data)
                        return None
                else:
                    missing = [f for f in required_fields if f not in data]
                    self.log_test("Spin Roulette", False, f"Missing fields: {missing}", data)
                    return None
            else:
                self.log_test("Spin Roulette", False, f"HTTP {response.status_code}", response.text)
                return None
        except Exception as e:
            self.log_test("Spin Roulette", False, f"Exception: {str(e)}")
            return None
    
    def test_get_winners(self):
        """Test 7: Get winners history"""
        try:
            response = self.session.get(f"{self.base_url}/api/roulette/winners")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("Get Winners", True, 
                                f"Retrieved {len(data)} winners", data)
                    return data
                else:
                    self.log_test("Get Winners", False, "Response is not a list", data)
                    return None
            else:
                self.log_test("Get Winners", False, f"HTTP {response.status_code}", response.text)
                return None
        except Exception as e:
            self.log_test("Get Winners", False, f"Exception: {str(e)}")
            return None
    
    def test_spin_with_insufficient_participants(self):
        """Test 8: Edge case - spin with < 2 participants"""
        try:
            # First, update to have only 1 participant
            payload = {"participants": ["Single Player"]}
            update_response = self.session.put(f"{self.base_url}/api/roulette/game/participants", 
                                             json=payload)
            
            if update_response.status_code == 200:
                # Now try to spin
                response = self.session.post(f"{self.base_url}/api/roulette/spin")
                if response.status_code == 400:
                    self.log_test("Spin with Insufficient Participants", True, 
                                "Correctly rejected spin with < 2 participants", response.json())
                    return True
                else:
                    self.log_test("Spin with Insufficient Participants", False, 
                                f"Expected 400, got {response.status_code}", response.text)
                    return False
            else:
                self.log_test("Spin with Insufficient Participants", False, 
                            "Failed to set up test condition", update_response.text)
                return False
        except Exception as e:
            self.log_test("Spin with Insufficient Participants", False, f"Exception: {str(e)}")
            return False
    
    def test_reset_game(self):
        """Test 9: Reset game functionality"""
        try:
            response = self.session.delete(f"{self.base_url}/api/roulette/game/reset")
            if response.status_code == 200:
                data = response.json()
                default_participants = [
                    "Ana García",
                    "Carlos Rodríguez", 
                    "María López",
                    "José Martínez",
                    "Laura González",
                    "Pablo Sánchez"
                ]
                
                if (data.get('participants') == default_participants and 
                    len(data.get('winners', [])) == 0):
                    self.log_test("Reset Game", True, 
                                "Game reset to default state with 6 participants", data)
                    return data
                else:
                    self.log_test("Reset Game", False, "Game not reset correctly", data)
                    return None
            else:
                self.log_test("Reset Game", False, f"HTTP {response.status_code}", response.text)
                return None
        except Exception as e:
            self.log_test("Reset Game", False, f"Exception: {str(e)}")
            return None
    
    def test_multiple_spins_flow(self):
        """Test 10: Multiple spins to verify winner removal and history"""
        try:
            # Reset game first
            reset_result = self.test_reset_game()
            if not reset_result:
                return False
            
            initial_participants = len(reset_result.get('participants', []))
            winners_found = []
            
            # Perform 3 spins
            for i in range(3):
                spin_result = self.test_spin_roulette()
                if spin_result:
                    winner_name = spin_result['winner']['name']
                    winners_found.append(winner_name)
                    remaining = len(spin_result['remaining_participants'])
                    expected_remaining = initial_participants - (i + 1)
                    
                    if remaining != expected_remaining:
                        self.log_test("Multiple Spins Flow", False, 
                                    f"Spin {i+1}: Expected {expected_remaining} remaining, got {remaining}")
                        return False
                else:
                    self.log_test("Multiple Spins Flow", False, f"Spin {i+1} failed")
                    return False
                
                time.sleep(0.5)  # Small delay between spins
            
            # Verify winners history
            winners_history = self.test_get_winners()
            if winners_history and len(winners_history) == 3:
                self.log_test("Multiple Spins Flow", True, 
                            f"Successfully completed 3 spins, winners: {winners_found}")
                return True
            else:
                self.log_test("Multiple Spins Flow", False, 
                            f"Winners history incorrect: expected 3, got {len(winners_history) if winners_history else 0}")
                return False
                
        except Exception as e:
            self.log_test("Multiple Spins Flow", False, f"Exception: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all tests in sequence"""
        print("🎯 Starting Roulette Backend API Tests")
        print("=" * 50)
        
        # Test sequence
        tests = [
            self.test_health_check,
            self.test_get_current_game,
            self.test_create_new_game,
            self.test_update_participants,
            self.test_get_participants,
            self.test_spin_roulette,
            self.test_get_winners,
            self.test_spin_with_insufficient_participants,
            self.test_reset_game,
            self.test_multiple_spins_flow
        ]
        
        passed = 0
        failed = 0
        
        for test in tests:
            try:
                result = test()
                if result is not False:  # True or data returned
                    passed += 1
                else:
                    failed += 1
            except Exception as e:
                print(f"❌ FAIL {test.__name__}: Unexpected exception: {str(e)}")
                failed += 1
            
            print("-" * 30)
        
        # Summary
        print("\n📊 TEST SUMMARY")
        print("=" * 50)
        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {failed}")
        print(f"📈 Success Rate: {(passed/(passed+failed)*100):.1f}%")
        
        # Detailed results
        print("\n📋 DETAILED RESULTS")
        print("=" * 50)
        for result in self.test_results:
            status = "✅" if result['success'] else "❌"
            print(f"{status} {result['test']}: {result['details']}")
        
        return passed, failed, self.test_results

if __name__ == "__main__":
    tester = RouletteAPITester()
    passed, failed, results = tester.run_all_tests()
    
    # Exit with appropriate code
    exit(0 if failed == 0 else 1)