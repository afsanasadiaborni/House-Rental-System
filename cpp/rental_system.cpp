// Simple Console-Based House Rental System (C++17)
// This is a minimal data model that mirrors the web app's entities.
// Build: g++ -std=c++17 rental_system.cpp -o rental && ./rental
#include <bits/stdc++.h>
using namespace std;

struct Apartment {
    string number;
    int rooms;
    string address;
    int rent;
    bool occupied;
};
struct Landlord {
    string name, mobile, apartmentNo, address;
    int rent;
};
struct Tenant {
    string name, mobile, gender, availability, apartmentNo;
};
struct Payment {
    string name, mobile, gender, apartmentNo, date;
    int amount, months;
};

string today() {
    time_t t = time(nullptr);
    tm *lt = localtime(&t);
    char buf[11];
    strftime(buf, sizeof(buf), "%Y-%m-%d", lt);
    return string(buf);
}

int main(){
    vector<Apartment> apartments = {
        {"101", 3, "Dhaka, Mirpur 1", 18000, false},
        {"102", 2, "Dhaka, Mirpur 2", 15000, true},
        {"103", 3, "Dhaka, Mirpur 3", 19000, false}
    };
    vector<Landlord> landlords = {
        {"Rahim Uddin","01711111111","101","Dhaka, Mirpur 1",18000},
        {"Karim Ahmed","01722222222","102","Dhaka, Mirpur 2",15000}
    };
    vector<Tenant> tenants = {
        {"Sumaiya","01633333333","Female","Assigned","102"},
        {"Faisal","01544444444","Male","Looking",""}
    };
    vector<Payment> payments = {
        {"Sumaiya","01633333333","Female","102",today(),15000,1}
    };

    int occupied = count_if(apartments.begin(), apartments.end(),
                            [](const Apartment&a){return a.occupied;});
    cout << "=== Dashboard ===\n";
    cout << "Total Apartments: " << apartments.size() << "\n";
    cout << "Occupied: " << occupied << "\n";
    cout << "Available: " << (apartments.size()-occupied) << "\n\n";

    cout << "Tenants:\n";
    for(size_t i=0;i<tenants.size();++i){
        auto&t=tenants[i];
        cout << i+1 << ". " << t.name << " | " << t.mobile << " | " << t.gender
             << " | Apt: " << (t.apartmentNo.empty()? "-" : t.apartmentNo) << "\n";
    }

    cout << "\n-- Record a sample payment --\n";
    Payment p{"Faisal","01544444444","Male","103",today(),19000,1};
    payments.push_back(p);
    cout << "Added payment for " << p.name << " amount " << p.amount << " on " << p.date << "\n";

    cout << "\nPayments list:\n";
    for(size_t i=0;i<payments.size();++i){
        auto&x=payments[i];
        cout << i+1 << ". " << x.name << " | " << x.mobile << " | Apt " << x.apartmentNo
             << " | " << x.amount << " | " << x.months << " month(s) | " << x.date << "\n";
    }
    return 0;
}
