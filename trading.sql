/*
SQLyog Enterprise - MySQL GUI v8.12 
MySQL - 5.6.16 : Database - trading
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

CREATE DATABASE /*!32312 IF NOT EXISTS*/`trading` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `trading`;

/*Table structure for table `user_info` */

DROP TABLE IF EXISTS `user_info`;

CREATE TABLE `user_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `userpassword` varchar(50) NOT NULL,
  `useremail` varchar(50) NOT NULL,
  `walletaddress` varchar(50) NOT NULL,
  `seed` varchar(100) NOT NULL,
  `isAllow` enum('Y','N') NOT NULL DEFAULT 'N',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8;

/*Data for the table `user_info` */

insert  into `user_info`(`id`,`username`,`userpassword`,`useremail`,`walletaddress`,`seed`,`isAllow`) values (31,'a','0b4e7a0e5fe84ad35fb5f95b9ceeac79','a@a.aaaa','0x746ae99b714f35a3160cb75678affb618d519ac5','','N'),(32,'a','f6fdffe48c908deb0f4c3bd36c032e72','a@a.cd','0xfbea336a53688cf260d05e35f2909a9a49a79782','','N'),(33,'admin','f6fdffe48c908deb0f4c3bd36c032e72','admin@admin.com','0x98b7b065f7634822dd09eca7b40c0f337ab4bff4','foil profit local prison kit time history hard ankle lazy machine region','N'),(34,'test','f6fdffe48c908deb0f4c3bd36c032e72','test@gm.com','0x1da731ca877eef091f0b45d291f599ffcf2bf2ab','gossip hurry illness timber fever life naive own hole butter illegal brush','N');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
