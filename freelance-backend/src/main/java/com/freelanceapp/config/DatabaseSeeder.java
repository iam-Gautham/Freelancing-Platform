package com.freelanceapp.config;

import com.freelanceapp.model.Bid;
import com.freelanceapp.model.Job;
import com.freelanceapp.model.User;
import com.freelanceapp.repository.BidRepository;
import com.freelanceapp.repository.JobRepository;
import com.freelanceapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private BidRepository bidRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Clear all existing data to clean up cluttered users, jobs, and bids
        bidRepository.deleteAll();
        jobRepository.deleteAll();
        userRepository.deleteAll();

        // 1. Create a Seed Client
        User client = new User();
        client.setUsername("alex_jones");
        client.setPassword(passwordEncoder.encode("password"));
        client.setEmail("alex.jones@taskhub.com");
        client.setUserType("client");
        User savedClient = userRepository.save(client);

        // 2. Create a Seed Freelancer
        User freelancer = new User();
        freelancer.setUsername("elena_rodriguez");
        freelancer.setPassword(passwordEncoder.encode("password"));
        freelancer.setEmail("elena.rodriguez@taskhub.com");
        freelancer.setUserType("freelancer");
        User savedFreelancer = userRepository.save(freelancer);

        // 3. Create Seed Jobs
        Job job1 = new Job();
        job1.setClientId(savedClient.getUserId());
        job1.setTitle("Redesign Brand Website to Glassmorphism");
        job1.setDescription("We need a senior React engineer to redesign our marketing site with glassmorphic cards, glowing mesh backgrounds, and smooth spring-based hover animations.");
        job1.setBudget(1200.0);
        job1.setStatus("open");
        Job savedJob1 = jobRepository.save(job1);

        Job job2 = new Job();
        job2.setClientId(savedClient.getUserId());
        job2.setTitle("Spring Boot Stripe Integration");
        job2.setDescription("Need a backend developer to set up checkout sessions, payment intent handlers, and webhook signature verification for a subscription SaaS platform.");
        job2.setBudget(650.0);
        job2.setStatus("open");
        jobRepository.save(job2);

        // 4. Create Seed Bid on Job 1
        Bid bid1 = new Bid();
        bid1.setJobId(savedJob1.getJobId());
        bid1.setFreelancerId(savedFreelancer.getUserId());
        bid1.setBidAmount(1100.0);
        bid1.setProposal("Hello! I specialize in CSS custom variables, backdrop filters, and framer-motion micro-interactions. I have reviewed your requirement and can deliver a state-of-the-art UI in 5 days.");
        bid1.setStatus("pending");
        bidRepository.save(bid1);

        System.out.println(">>> Database seeded successfully: users 'alex_jones' and 'elena_rodriguez' created.");
    }
}
