-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: localhost    Database: mybookstore
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `careers`
--

DROP TABLE IF EXISTS `careers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `careers` (
  `available` bit(1) NOT NULL,
  `date_posted` date DEFAULT NULL,
  `version` int NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `category` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `level` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `requirements` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `careers`
--

LOCK TABLES `careers` WRITE;
/*!40000 ALTER TABLE `careers` DISABLE KEYS */;
INSERT INTO `careers` VALUES (_binary '','2024-08-14',0,1,'Software','Collaborate with cross-functional teams to develop innovative software solutions and enhance existing applications.','Junior','Israel','Basic knowledge of Python or Java. Understanding of software development principles. Eager to learn and adapt.','Junior Software Engineer'),(_binary '','2024-08-14',0,2,'Software','Assist in designing and developing scalable web applications, focusing on user experience and interface design.','Junior','Israel','Familiarity with HTML, CSS, and JavaScript frameworks. Basic understanding of web design principles. Strong desire to improve skills.','Junior UI/UX Developer'),(_binary '','2024-08-14',0,3,'Software','Work on backend systems, including API development and database management, to support application functionality.','Junior','Israel','Knowledge of server-side languages like Node.js or Java. Basic understanding of databases. Willingness to learn and grow.','Junior Backend Engineer'),(_binary '','2024-08-14',0,4,'Software','Perform automated and manual testing of software applications to ensure quality and performance standards.','Junior','Israel','Understanding of testing methodologies. Familiarity with testing tools. Detail-oriented with a passion for quality.','Junior QA Tester'),(_binary '','2024-08-14',0,5,'Software','Support the development of mobile applications, integrating with APIs and ensuring cross-platform compatibility.','Junior','Israel','Knowledge of mobile development frameworks such as React Native. Basic understanding of mobile UX/UI. Enthusiasm for mobile tech.','Junior Mobile App Developer'),(_binary '','2024-08-14',0,6,'Hardware','Assist in the development and testing of new hardware prototypes, including assembly and performance evaluation.','Junior','Israel','Degree in Electronics or related field. Basic knowledge of hardware design. Strong interest in hands-on work.','Junior Electronics Engineer'),(_binary '','2024-08-14',0,7,'Hardware','Support the production and maintenance of hardware components, ensuring they meet quality standards and performance criteria.','Junior','Israel','Basic knowledge of hardware production processes. Familiarity with quality control techniques. Ability to follow technical instructions.','Junior Hardware Technician'),(_binary '','2024-08-14',2,8,'Marketing','Assist in executing marketing campaigns, creating promotional content, and analyzing campaign performance.','Junior','Israel','Degree in Marketing or related field. Basic understanding of digital marketing tools. Strong organizational skills.','Junior Marketing Specialist'),(_binary '','2024-08-14',0,9,'Marketing','Support the development of marketing strategies and materials, including social media content and advertising.','Junior','Israel','Familiarity with social media platforms. Basic understanding of marketing principles. Creativity and attention to detail.','Junior Marketing Assistant'),(_binary '','2024-08-14',0,10,'Sales','Help manage customer accounts, process orders, and provide excellent customer service.','Junior','Israel','Good communication skills. Basic understanding of sales processes. Customer-focused attitude.','Junior Sales Support'),(_binary '','2024-08-14',0,11,'Sales','Assist in identifying sales opportunities, preparing sales presentations, and maintaining client relationships.','Junior','Israel','Basic knowledge of sales techniques. Strong organizational skills. Willingness to learn and grow in sales.','Junior Sales Representative'),(_binary '','2024-08-14',0,12,'Finance','Support financial planning and analysis, including budgeting, forecasting, and financial reporting.','Junior','Israel','Degree in Finance or related field. Basic understanding of financial analysis. Strong analytical skills.','Junior Financial Analyst'),(_binary '','2024-08-14',0,13,'Finance','Assist in managing financial transactions, preparing reports, and supporting finance team activities.','Junior','Israel','Knowledge of accounting principles. Familiarity with financial software. Detail-oriented with good organizational skills.','Junior Accountant'),(_binary '','2024-08-14',0,14,'HR','Support HR activities such as recruitment, employee onboarding, and maintaining HR records.','Junior','Israel','Degree in Human Resources or related field. Basic understanding of HR functions. Good communication and organizational skills.','Junior HR Assistant'),(_binary '','2024-08-14',0,15,'HR','Assist in the development and implementation of HR policies, procedures, and employee engagement programs.','Junior','Israel','Knowledge of HR practices. Familiarity with employee engagement strategies. Strong interpersonal skills.','Junior HR Coordinator'),(_binary '','2024-08-14',0,16,'Software','Develop and maintain software applications, collaborate with other developers to enhance system features.','Junior','Israel','Knowledge of programming languages such as Python or Java. Basic understanding of software development methodologies. Willingness to learn new technologies.','Junior Application Developer'),(_binary '','2024-08-14',0,17,'Software','Create and optimize user interfaces for web applications, ensuring a seamless and engaging user experience.','Junior','Israel','Familiarity with frontend technologies such as HTML, CSS, and JavaScript. Basic knowledge of UX/UI design principles. Eagerness to learn and improve.','Junior Frontend Engineer'),(_binary '','2024-08-14',0,18,'Software','Assist in designing, coding, and debugging backend systems to support scalable and high-performance applications.','Junior','Israel','Basic knowledge of backend technologies like Node.js or Java. Understanding of database management. Strong problem-solving abilities.','Junior Backend Developer'),(_binary '','2024-08-14',0,19,'Software','Conduct quality assurance testing to identify and address bugs and ensure software meets high standards.','Junior','Israel','Understanding of software testing methodologies. Familiarity with testing tools. Attention to detail and a commitment to quality.','Junior QA Engineer'),(_binary '','2024-08-14',0,20,'Software','Develop and maintain mobile applications, focusing on delivering an excellent user experience across devices.','Junior','Israel','Basic knowledge of mobile development frameworks such as React Native or Flutter. Understanding of mobile UX/UI. Passion for mobile technology.','Junior Mobile Developer'),(_binary '','2024-08-14',0,21,'Hardware','Assist in the design and testing of electronic circuits and components for various hardware projects.','Junior','Israel','Degree in Electrical Engineering or related field. Basic understanding of electronics and circuit design. Hands-on experience with hardware.','Junior Electronics Technician'),(_binary '','2024-08-14',0,22,'Hardware','Support hardware development and testing activities, including assembly, troubleshooting, and quality assurance.','Junior','Israel','Basic knowledge of hardware components and systems. Familiarity with testing equipment. Ability to follow technical procedures.','Junior Hardware Engineer'),(_binary '','2024-08-14',0,23,'Marketing','Help execute digital marketing campaigns, track performance metrics, and analyze data to optimize strategies.','Junior','Israel','Understanding of digital marketing concepts. Familiarity with analytics tools. Strong analytical and communication skills.','Junior Digital Marketer'),(_binary '','2024-08-14',0,24,'Marketing','Assist with content creation and distribution for marketing purposes, including social media posts and blog articles.','Junior','Israel','Basic writing and editing skills. Knowledge of content management systems. Creativity and attention to detail.','Junior Content Creator'),(_binary '','2024-08-14',0,25,'Sales','Support the sales team by managing leads, preparing sales reports, and assisting with client communication.','Junior','Israel','Good organizational skills. Basic understanding of sales processes. Ability to manage multiple tasks efficiently.','Junior Sales Coordinator'),(_binary '','2024-08-14',0,26,'Sales','Assist in developing sales strategies, preparing presentations, and building relationships with potential clients.','Junior','Israel','Strong communication skills. Basic knowledge of sales techniques. Enthusiasm for sales and client interactions.','Junior Sales Associate'),(_binary '','2024-08-14',0,27,'Finance','Assist with financial reporting, budgeting, and forecasting to support the finance team\'s objectives.','Junior','Israel','Basic knowledge of financial principles. Familiarity with budgeting and forecasting processes. Strong analytical skills.','Junior Finance Assistant'),(_binary '','2024-08-14',0,28,'Finance','Support accounting functions, including transaction processing, reconciliations, and financial record maintenance.','Junior','Israel','Understanding of accounting practices. Familiarity with financial software. Detail-oriented with good organizational skills.','Junior Finance Clerk'),(_binary '','2024-08-14',0,29,'HR','Assist with employee recruitment, onboarding, and HR administrative tasks to support the HR department.','Junior','Israel','Degree in Human Resources or related field. Basic understanding of HR functions. Strong organizational and interpersonal skills.','Junior HR Generalist'),(_binary '','2024-08-14',0,30,'HR','Support HR initiatives, including employee engagement programs, policy implementation, and HR analytics.','Junior','Israel','Knowledge of HR policies and procedures. Familiarity with employee engagement strategies. Good communication skills.','Junior HR Specialist'),(_binary '','2024-08-14',0,31,'Software','Work with development teams to design, develop, and test software applications, contributing to project success.','Junior','Israel','Basic programming skills in languages like C++ or Java. Understanding of software development life cycle. Eager to learn and contribute.','Junior Software Developer'),(_binary '','2024-08-14',0,32,'Software','Develop user-friendly interfaces for web applications, ensuring a high-quality user experience across devices.','Junior','Israel','Familiarity with frontend technologies such as React or Angular. Basic understanding of web design principles. Passion for UI/UX.','Junior Frontend Developer'),(_binary '','2024-08-14',0,33,'Software','Support backend development by implementing features, debugging issues, and optimizing system performance.','Junior','Israel','Basic knowledge of server-side programming languages. Understanding of database management. Strong problem-solving skills.','Junior Backend Programmer'),(_binary '','2024-08-14',0,34,'Software','Perform software quality assurance tasks to ensure applications are reliable, functional, and meet user requirements.','Junior','Israel','Basic understanding of QA methodologies. Familiarity with testing tools and practices. Attention to detail and commitment to quality.','Junior QA Specialist'),(_binary '','2024-08-14',0,35,'Software','Develop mobile applications for Android and iOS platforms, focusing on performance and user experience.','Junior','Israel','Basic knowledge of mobile development frameworks. Understanding of mobile app architecture. Enthusiasm for mobile technologies.','Junior Mobile Application Developer'),(_binary '','2024-08-14',0,36,'Hardware','Assist in designing, assembling, and testing electronic systems and devices for various applications.','Junior','Israel','Degree in Electronics or related field. Basic knowledge of circuit design and assembly. Interest in electronics and hardware development.','Junior Electronics Designer'),(_binary '','2024-08-14',0,37,'Hardware','Support hardware development projects, including testing, troubleshooting, and optimizing hardware components.','Junior','Israel','Basic understanding of hardware testing techniques. Familiarity with electronic measurement tools. Strong problem-solving skills.','Junior Hardware Tester'),(_binary '','2024-08-14',0,38,'Marketing','Assist in executing marketing strategies, analyzing market trends, and creating promotional materials.','Junior','Israel','Degree in Marketing or related field. Basic knowledge of market analysis. Strong analytical and communication skills.','Junior Marketing Analyst'),(_binary '','2024-08-14',0,39,'Marketing','Support the creation of marketing content and materials, including advertisements, social media posts, and email campaigns.','Junior','Israel','Basic writing and content creation skills. Familiarity with content management systems. Creativity and attention to detail.','Junior Marketing Content Creator'),(_binary '','2024-08-14',0,40,'Sales','Manage customer inquiries, process sales orders, and support the sales team in achieving targets.','Junior','Israel','Good communication and organizational skills. Basic understanding of sales processes. Ability to handle customer interactions professionally.','Junior Sales Assistant'),(_binary '','2024-08-14',0,41,'Sales','Assist in generating sales leads, preparing sales reports, and providing support to the sales team.','Junior','Israel','Basic knowledge of sales techniques. Strong organizational skills. Eagerness to learn and support the sales process.','Junior Sales Executive'),(_binary '','2024-08-14',0,42,'Finance','Support the finance department with tasks related to budgeting, financial reporting, and transaction processing.','Junior','Israel','Degree in Finance or related field. Basic understanding of financial principles. Strong analytical and organizational skills.','Junior Finance Officer'),(_binary '','2024-08-14',0,43,'Finance','Assist with accounting functions, including ledger maintenance, financial reconciliations, and report preparation.','Junior','Israel','Understanding of accounting procedures. Familiarity with financial software. Attention to detail and accuracy.','Junior Finance Clerk'),(_binary '','2024-08-14',0,44,'HR','Assist in HR activities such as employee recruitment, onboarding, and maintaining HR records.','Junior','Israel','Degree in Human Resources or related field. Basic understanding of HR processes. Strong organizational skills.','Junior HR Manager'),(_binary '','2024-08-14',0,45,'HR','Support HR initiatives, including employee engagement programs, policy implementation, and HR analytics.','Junior','Israel','Knowledge of HR policies and procedures. Familiarity with employee engagement strategies. Good communication skills.','Junior HR Coordinator'),(_binary '','2024-08-14',0,46,'Software','Contribute to software development projects by designing, coding, and testing applications.','Junior','Israel','Basic knowledge of programming languages. Understanding of software development life cycle. Eager to learn and grow.','Junior Software Developer'),(_binary '','2024-08-14',0,47,'Software','Develop user-friendly web interfaces, ensuring high-quality design and functionality.','Junior','Israel','Familiarity with HTML, CSS, and JavaScript. Basic understanding of UI/UX principles. Creativity and attention to detail.','Junior Frontend Engineer'),(_binary '','2024-08-14',0,48,'Software','Assist in backend development tasks, including coding, debugging, and optimizing system performance.','Junior','Israel','Basic programming skills in languages like Java or Python. Understanding of databases. Strong problem-solving skills.','Junior Backend Programmer'),(_binary '','2024-08-14',0,49,'Software','Perform quality assurance testing on software applications to ensure they meet performance and reliability standards.','Junior','Israel','Basic knowledge of testing methodologies. Familiarity with QA tools. Detail-oriented with a focus on quality.','Junior QA Analyst'),(_binary '','2024-08-14',0,50,'Software','Develop and maintain mobile applications, ensuring high performance and user experience on mobile devices.','Junior','Israel','Basic knowledge of mobile development tools. Understanding of mobile app architecture. Enthusiasm for mobile development.','Junior Mobile Engineer'),(_binary '','2024-08-14',0,51,'Hardware','Assist in the design, development, and testing of electronic hardware for various applications.','Junior','Israel','Degree in Electronics or related field. Basic understanding of electronic components and systems. Hands-on experience with hardware.','Junior Electronics Technician'),(_binary '','2024-08-14',0,52,'Hardware','Support hardware development projects, including testing and optimizing electronic devices.','Junior','Israel','Basic knowledge of hardware testing techniques. Familiarity with electronic measurement tools. Strong analytical skills.','Junior Hardware Engineer'),(_binary '','2024-08-14',0,53,'Marketing','Assist with executing marketing campaigns, analyzing results, and creating engaging content.','Junior','Israel','Degree in Marketing or related field. Basic knowledge of digital marketing strategies. Good communication skills.','Junior Marketing Coordinator'),(_binary '','2024-08-14',0,54,'Marketing','Support content creation and distribution for marketing purposes, including social media and email marketing.','Junior','Israel','Basic writing and content creation skills. Familiarity with social media platforms. Creative and detail-oriented.','Junior Marketing Associate'),(_binary '','2024-08-14',0,55,'Sales','Assist with managing sales processes, handling customer inquiries, and preparing sales reports.','Junior','Israel','Good organizational and communication skills. Basic understanding of sales processes. Ability to manage multiple tasks.','Junior Sales Support'),(_binary '','2024-08-14',0,56,'Sales','Support the sales team by generating leads, preparing presentations, and maintaining client relationships.','Junior','Israel','Basic knowledge of sales techniques. Strong communication skills. Enthusiasm for client interactions.','Junior Sales Associate'),(_binary '','2024-08-14',0,57,'Finance','Assist with financial planning and analysis, including budgeting, forecasting, and financial reporting.','Junior','Israel','Degree in Finance or related field. Basic understanding of financial analysis. Strong analytical and organizational skills.','Junior Finance Analyst'),(_binary '','2024-08-14',0,58,'Finance','Support accounting functions, including transaction processing, reconciliations, and financial reporting.','Junior','Israel','Understanding of accounting principles. Familiarity with financial software. Detail-oriented and accurate.','Junior Accounting Assistant'),(_binary '','2024-08-14',0,59,'HR','Assist with HR administrative tasks, including recruitment, onboarding, and employee records management.','Junior','Israel','Degree in Human Resources or related field. Basic understanding of HR processes. Strong organizational skills.','Junior HR Assistant'),(_binary '','2024-08-14',3,60,'HR','Support various HR functions, including employee engagement, policy implementation, and HR reporting.','Entry','Israel','Knowledge of HR practices. Good communication skills. Ability to handle HR tasks efficiently.','Junior HR Officer'),(_binary '','2024-08-17',0,61,'Cybersecurity','Oversee and implement security measures to safeguard the organization’s IT infrastructure and data.','Senior','USA','Expertise in cybersecurity frameworks and tools. Strong understanding of network security protocols. Proven experience in threat analysis and mitigation.','Senior Security Analyst'),(_binary '','2024-08-17',1,62,'Data Science','Analyze large datasets to derive actionable insights and drive strategic business decisions.','Team Lead','Remote','Proficiency in data analysis tools such as R or Python. Strong statistical background and experience with machine learning models. Excellent problem-solving skills.','Lead Data Scientist'),(_binary '','2024-08-17',0,63,'Cloud Computing','Design and implement cloud-based solutions to optimize infrastructure and application performance.','Mid-Level','Israel','Experience with cloud platforms such as AWS, Azure, or Google Cloud. Knowledge of cloud architecture and services. Strong troubleshooting and analytical skills.','Cloud Solutions Architect'),(_binary '','2024-08-17',0,64,'Artificial Intelligence','Develop and deploy AI models and algorithms to enhance product functionality and user experience.','Senior','USA','Deep knowledge of AI and machine learning frameworks. Experience with neural networks and natural language processing. Strong programming skills in Python or Java.','Senior AI Engineer'),(_binary '','2024-08-17',4,65,'Blockchain','Design and develop blockchain-based applications and solutions to improve security and transparency.','Team Lead','Remoteu','Proficiency in blockchain technologies and smart contracts. Experience with Ethereum or Hyperledger. Strong understanding of cryptography and distributed systems.','Lead Blockchain Developer'),(_binary '','2024-08-26',10,66,'Internet of Things','Create and maintain IoT systems and devices to integrate with existing technology and enhance functionality.','Junior','USA','Experience with IoT protocols and sensors. Knowledge of embedded systems and real-time operating systems. Strong programming skills in C or Python.','IoT Systems Engineer');
/*!40000 ALTER TABLE `careers` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-08-19  0:27:23
